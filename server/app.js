const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// MongoDB connection
mongoose.connect(process.env.ATLAS_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Define a schema and model
const FileSchema = new mongoose.Schema({
  fileName: String,
  data: Buffer,
});

const FileModel = mongoose.model("File", FileSchema);

// Express routes
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const newFile = new FileModel({
      fileName: req.file.originalname,
      data: req.file.buffer,
    });

    await newFile.save();
    res.send("File uploaded successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get("/files", async (req, res) => {
  try {
    const files = await FileModel.find({}, "fileName");
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get("/download/:fileName", async (req, res) => {
  try {
    const { fileName } = req.params;
    const file = await FileModel.findOne({ fileName });

    if (!file) {
      return res.status(404).send("File not found");
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${file.fileName}`
    );
    res.send(file.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
