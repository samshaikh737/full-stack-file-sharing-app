const router = require("express").Router();
const fileModel = require("../models/fileModel");

const fetchData = require("../script");

router.get("/:uuid", async (req, res) => {
    
    fetchData().then();
    
    try {
        const uuid = req.params?.uuid;
        const checkUuid = await fileModel.findOne({ uuid });
        if (!checkUuid) return res.render("download",{ "error":"link has been expired."});
        
        const downloadlink = `${process.env.APP_BASE_URL}/files/download/${checkUuid.uuid}`;
        
        res.render("download",{
            "data":checkUuid.uuid,
            "filename" : checkUuid.filename,
            "filesize": checkUuid.size,
            "downloadLink": downloadlink
        });
        
    } catch (error) {
        console.log(error)
        return res.render("download",{ "error":"Something went wrong."});
    }

})

module.exports = router;