const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const {
  connectToPlc,
  disconnectFromPlc,
  readData,
  writeData,
} = require("./snap7Client");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post("/connect", async (req, res) => {
  const { ip, rack, slot } = req.body;
  try {
    const result = await connectToPlc(ip, rack, slot);
    res.json({ success: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/disconnect", async (req, res) => {
  try {
    const result = await disconnectFromPlc();
    res.json({ success: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/read", async (req, res) => {
  const { dbNumber, startByte, length } = req.body;
  try {
    const data = await readData(dbNumber, startByte, length);
    res.json({ data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/write", async (req, res) => {
  const { dbNumber, startByte, data } = req.body;
  try {
    const success = await writeData(dbNumber, startByte, data);
    res.json({ success });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
