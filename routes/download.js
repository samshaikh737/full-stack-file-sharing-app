const router = require("express").Router();
const fileModel = require("../models/fileModel");

router.get("/:uuid", async (req, res) => {
    try {
        const uuid = req.params?.uuid;
        const checkUuid = await fileModel.findOne({ uuid });
        if (!checkUuid) return res.render("download",{ "error":"link has been expired."});

        const filePath = `${__dirname}/../${checkUuid.path}`;
        res.download(filePath)

    } catch (error) {
        console.log(error)
        return res.render("download",{ "error":"Something went wrong."});
    }

})

module.exports = router;
