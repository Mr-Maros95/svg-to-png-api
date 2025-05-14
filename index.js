const express = require("express");
const puppeteer = require("puppeteer");
const app = express();

app.use(express.json({ limit: "1mb" }));

app.post("/convert", async (req, res) => {
  const svg = req.body.svg;
  if (!svg) return res.status(400).send("No SVG provided");

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const html = `<body style="margin:0;padding:0;">${svg}</body>`;
  await page.setContent(html);

  const svgHandle = await page.$("svg");
  const buffer = await svgHandle.screenshot({ omitBackground: true });

  await browser.close();

  res.set("Content-Type", "image/png");
  res.send(buffer);
});

app.get("/", (req, res) => {
  res.send("SVG to PNG API is running.");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
