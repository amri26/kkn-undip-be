const { google } = require("googleapis");

require("dotenv").config();

const getDriveService = () => {
    const SCOPES = ["https://www.googleapis.com/auth/drive"];

    const auth = new google.auth.GoogleAuth({
        keyFile: process.env.KEYFILEPATH,
        scopes: SCOPES,
    });

    const driveService = google.drive({ version: "v3", auth });
    return driveService;
};

module.exports = getDriveService;
