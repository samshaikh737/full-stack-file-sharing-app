const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fileModel = require("../models/fileModel");

const { v4: uuid64 } = require("uuid");
const { diskStorage } = require("multer");

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.random(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName)
    }
})

let upload = multer({
    storage,
    limits: { fileSize: 1000000000 }
}).single("myfile");

router.post('/', (req, res) => {

    //store file
    upload(req, res, async (err) => {

        //Validate request
        if (!req.file) {
            return res.status(400).json({ "error": "All Fields are required." })
        }
        if (err) {
            return res.status(500).send({ "error": err.message })
        }

        //store into Database
        const file = new fileModel({
            filename: req.file.filename, //filename get Stroge function
            uuid: uuid64(), // genrate uuid
            path: req.file.path, // destination get Stroge function,
            size: req.file.size
        });

        const response = await file.save();
        const fileUrl = { "file": `${process.env.APP_BASE_URL}/files/${response.uuid}` };

        // response -> Link
        return res.json(fileUrl)
    });

})

router.post("/send", async (req, res) => {

    const { uuid, emailTo, emailFrom } = req.body;
    //validate request
    if (!uuid || !emailTo || !emailFrom) return res.status(422).send({ "error": "All fields are required." });

    //Get Data from database
    const file = await fileModel.findOne({ uuid });
    if (file.sender) return res.status(422).send({ "error": "Email already sent..." });

    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();

    //send email
    const sendMail = require("../services/emailService");

    sendMail({
        from: emailFrom,
        to: emailTo,
        subject: "File Sharing",
        text: `${emailFrom} shared file with you.`,
        html: require("../services/emailTemplate")({
            emailFrom,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: parseInt(file.size / 1000) + "KB",
            expires: '24 hrs'
        })
    })

    return res.send({ "success": true })
});

module.exports = router;