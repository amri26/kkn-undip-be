const { google } = require("googleapis");
const stream = require("stream");

require("dotenv").config();

upload = async (fileObject) => {
    const SCOPES = ["https://www.googleapis.com/auth/drive"];

    const auth = new google.auth.GoogleAuth({
        keyFile: process.env.KEYFILEPATH,
        scopes: SCOPES,
    });

    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileObject.buffer);

    await google.drive({ version: "v3", auth }).files.create({
        media: {
            mimeType: fileObject.mimeType,
            body: bufferStream,
        },
        requestBody: {
            name: fileObject.originalname,
            parents: [process.env.DRIVE_FOLDER_ID],
        },
    });
};

module.exports = upload;
