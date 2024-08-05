const express = require("express");
const bodyParser = require('body-parser');

const cors = require('cors');
const app = express();
app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "http://localhost:3001",
      ],
      credentials: true,
    })
  );
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
const router = require("./routes");
app.use("/api", router);


const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🚀  Server is running!
      🔉  Listening on port ${PORT}
      📭  Query at ${"http://localhost"}:${PORT}`);
});