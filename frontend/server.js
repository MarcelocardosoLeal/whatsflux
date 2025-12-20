const express = require("express");
const path = require("path");
const app = express();

const { REACT_APP_BACKEND_URL, REACT_APP_HOURS_CLOSE_TICKETS_AUTO } = process.env;

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

app.use(express.static(path.join(__dirname, "build"), { etag: false, maxAge: 0 }));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.listen(3250, () => {
  console.log(`Server is running on port 3250`);
  console.log(`Backend URL: ${REACT_APP_BACKEND_URL}`);
  console.log(`Close Tickets Auto Hours: ${REACT_APP_HOURS_CLOSE_TICKETS_AUTO}`);
});
