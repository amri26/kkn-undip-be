const { error } = require("console");
const { google } = require("googleapis");
const stream = require("stream");

const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
    keyFile: process.env.KEYFILEPATH,
    scopes: SCOPES,
});

const uploadDrive = async (fileObject, fileType, parentsFolder) => {
    try {
        const mime = fileObject.mimetype.split("/");
        const extension = mime[mime.length - 1];
        const filename = `${fileType}_${Date.now()}.${extension}`;

        const bufferStream = new stream.PassThrough();
        bufferStream.end(fileObject.buffer);

        const file = await google.drive({ version: "v3", auth }).files.create({
            media: {
                mimeType: fileObject.mimeType,
                body: bufferStream,
            },
            requestBody: {
                name: filename,
                parents: [parentsFolder],
            },
            fields: "id",
        });

        if (file.status !== 200) {
            throw error;
        }

        return file;
    } catch (error) {
        throw error;
    }
};

const downloadDrive = async (fileId) => {
    try {
        const file = await google.drive({ version: "v3", auth }).files.get({
            fileId,
            fields: "webContentLink", //"webContentLink,name,id"
        });

        if (file.status !== 200) {
            throw error;
        }

        return file;
    } catch (error) {
        throw error;
    }
};

module.exports = { uploadDrive, downloadDrive };
