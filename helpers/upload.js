const { google } = require("googleapis");
const stream = require("stream");

const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
    keyFile: process.env.KEYFILEPATH,
    scopes: SCOPES,
});

const uploadDrive = async (fileObject, parentsFolder) => {
    try {
        const bufferStream = new stream.PassThrough();
        bufferStream.end(fileObject.buffer);

        const file = await google.drive({ version: "v3", auth }).files.create({
            media: {
                mimeType: fileObject.mimeType,
                body: bufferStream,
            },
            requestBody: {
                name: fileObject.originalname,
                parents: [parentsFolder],
            },
            fields: "id",
        });

        return file;
    } catch (error) {
        throw error;
    }
};

const downloadDrive = async (fileId) => {
    try {
        const file = await google.drive({ version: "v3", auth }).files.get({
            fileId,
            alt: "media",
        });

        return file;
    } catch (error) {
        throw error;
    }
};

module.exports = { uploadDrive, downloadDrive };
