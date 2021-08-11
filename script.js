const fileModel = require("./models/fileModel");
const fs = require("fs");

const connectDB = require("./config/db");
connectDB();

async function fetchData() {
    const pastDate = new Date(Date.now() -24 * 60 * 60 * 1000);
    const files = await fileModel.find({ createdAt : { $lt : pastDate } });

    if (files.length){
        for(const file of files){
            
            try {
                fs.unlinkSync(file.path);
                await file.remove();
                console.log(`successfully deleted ${file.filename}`);
            } catch (error) {
                console.log(`error while deleting file ${error}`);
            }

        }
        console.log(`Job Done!`);
    }
}

module.exports = fetchData;
