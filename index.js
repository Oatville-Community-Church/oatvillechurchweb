/**
 * Legacy Express Server
 * 
 * Note: This file is kept for backwards compatibility.
 * For the new build system, use:
 * - `npm run dev` for development with hot reloading
 * - `npm run serve` for production serving
 */

const path = require("path");
const express = require("express");
const app = express();

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public/")));
app.use(express.static(path.join(__dirname, "pages/")));

// Main route - serve the built index.html
app.get("/", (req, res) => {
  const indexPath = path.join(__dirname, "public/index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error("Error serving index.html:", err);
      res.status(404).send("Page not found. Please run 'npm run build' first.");
    }
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    message: "Legacy server running. Consider using 'npm run dev' or 'npm run serve' for better experience."
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("🚀 Legacy server running on port", port);
  console.log("💡 For better development experience, use:");
  console.log("   npm run dev    - Development with hot reloading");
  console.log("   npm run serve  - Production server");
});