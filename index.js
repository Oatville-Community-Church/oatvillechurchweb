const { exec } = require('child_process');
const path = require("path")
const express = require("express")
const app = express()

app.use(express.static(path.join(__dirname, "public/")))
app.use(express.static(path.join(__dirname, "pages/")))

app.get("/", (req,res) => {
  // Build SASS to CSS
  exec('npm run build-sass', (err, stdout, stderr) => {
    if (err) {
      console.error('SASS build error:', err);
    }
  });
  
  // Build Tailwind CSS
  exec('npx tailwindcss -i ./input.css -o ./public/out.css', (err, stdout, stderr) => {
    if (err) {
      console.error('Tailwind build error:', err);
    }
  });
  
  // Copy assets
  exec('npm run copy-assets && npm run copy-html', (err, stdout, stderr) => {
    if (err) {
      console.error('Copy assets error:', err);
    }
  });
  
  res.sendFile(path.join(__dirname, "public/index.html"))
})

app.listen(3000, () => {
  console.log("🚀 Shipping on port 3000")
})