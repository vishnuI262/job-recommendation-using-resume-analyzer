const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs").promises;
const crypto = require("crypto");
const morgan = require("morgan");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
});

const uploadDir = process.env.UPLOAD_DIR || "uploads";
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const randomName = crypto.randomBytes(16).toString("hex");
        const fileExtension = path.extname(file.originalname);
        cb(null, `${randomName}${fileExtension}`);
    },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: "Please upload a file" });
        }

        const pythonProcess = spawn("python", [path.join(__dirname, 'resumeProcessor.py'), req.file.path]);

        let dataToSend = "";
        let errorData = "";

        pythonProcess.stdout.on("data", (data) => {
            dataToSend += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorData += data.toString();
            console.error(`Python script error: ${data}`);
        });

        pythonProcess.on("close", async (code) => {
            try {
                await fs.unlink(req.file.path); // Clean up the uploaded file
            } catch (cleanupError) {
                console.error("Error deleting file:", cleanupError);
            }

            if (code !== 0) {
                console.error(`Python process exited with code ${code}: ${errorData}`);
                let parsedError;
                try {
                    parsedError = JSON.parse(errorData);
                } catch (jsonError) {
                    parsedError = { message: errorData };
                }
                return res.status(500).send({ message: "Error processing the file", error: parsedError });
            }

            try {
                const recommendations = JSON.parse(dataToSend);
                res.send({ message: "File processed successfully", recommendations });
            } catch (parseError) {
                console.error("Error parsing JSON:", parseError);
                return res.status(500).send({ message: "Error parsing recommendations", error: parseError.message });
            }
        });
    } catch (error) {
        console.error("General error in /upload route:", error);
        res.status(500).send({ message: 'Upload failed', error: error.message });
    }
});

app.get("/", (req, res) => {
    res.send("Job recommendation API is running ....");
});

app.delete("/cleanup/:filename", async (req, res) => {
    try {
        const filePath = path.join(__dirname, uploadDir, req.params.filename);
        await fs.unlink(filePath);
        res.send({ message: "File deleted successfully" });
    } catch (err) {
        console.error("Error deleting file:", err);
        res.status(500).send({ message: "Error deleting file", error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));