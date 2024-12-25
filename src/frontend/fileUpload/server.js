const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors"); // Import the 'cors' middleware

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS to allow requests from your local client
app.use(
  cors({
    origin: "http://127.0.0.1:5500", // URL of your local client
    optionsSuccessStatus: 200,
  })
);

// Configure multer for storing chunks
const storage = multer.memoryStorage(); // Store in memory for simplicity
const upload = multer({ storage: storage });

// Endpoint to handle chunk uploads
app.post("/uploads", upload.single("file"), async (req, res) => {
  const { name, chunk_number, total_chunks } = req.body;
  const isLastChunk = parseInt(chunk_number) + 1 === parseInt(total_chunks);

  // Create a directory for chunks if it doesn't exist
  const chunkDir = path.join(__dirname, "chunks");
  if (!fs.existsSync(chunkDir)) {
    fs.mkdirSync(chunkDir);
  }

  // Write the chunk to a temporary file
  const chunkFilePath = path.join(chunkDir, `${name}_${chunk_number}`);
  fs.writeFile(chunkFilePath, req.file.buffer, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error occurred while writing the file.");
    }

    // If this is the last chunk, merge all chunks into a single file
    if (isLastChunk) {
      mergeChunks(name, total_chunks);
    }

    return res.status(200).json({ message: "Chunk Uploaded" });
  });
});

// Function to merge chunks into a final file
const mergeChunks = (fileName, totalChunks) => {
  const finalDir = path.join(__dirname, "uploads");
  const finalFilePath = path.join(finalDir, fileName);

  // Create the directory for the final merged file if it doesn't exist
  if (!fs.existsSync(finalDir)) {
    fs.mkdirSync(finalDir);
  }

  const writeStream = fs.createWriteStream(finalFilePath);

  // Initialize an index for tracking the merged chunks count
  let currentChunkIndex = 0;

  const mergeNextChunk = () => {
    if (currentChunkIndex >= totalChunks) {
      writeStream.end(); // Close the write stream after the last chunk
      console.log("All chunks merged successfully.");
      return;
    }

    const chunkFilePath = path.join(
      __dirname,
      "chunks",
      `${fileName}_${currentChunkIndex}`
    );
    const readStream = fs.createReadStream(chunkFilePath);

    readStream.pipe(writeStream, { end: false });

    readStream.on("end", () => {
      // Remove the chunk file after merging
      fs.unlinkSync(chunkFilePath);
      currentChunkIndex++;
      mergeNextChunk(); // Proceed to the next chunk
    });

    readStream.on("error", (err) => {
      console.error(`Error reading chunk ${currentChunkIndex}:`, err);
    });
  };

  mergeNextChunk();
};

app.get('/download', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', 'test.txt'); // Path to your large file
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = (end - start) + 1;
        const file = fs.createReadStream(filePath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'application/octet-stream',
        };

        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'application/octet-stream',
        };

        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
    }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
