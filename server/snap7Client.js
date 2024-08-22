const snap7 = require("node-snap7");
const client = new snap7.S7Client();

const connectToPlc = (ip, rack, slot) => {
  return new Promise((resolve, reject) => {
    client.ConnectTo(ip, rack, slot, (err) => {
      if (err) {
        console.error("Error connecting to PLC: ", err);
        reject(err);
      } else {
        console.log("Connected to PLC");
        resolve(true);
      }
    });
  });
};

const disconnectFromPlc = () => {
  return new Promise((resolve, reject) => {
    client.Disconnect((err) => {
      if (err) {
        console.error("Error disconnecting from PLC: ", err);
        reject(err);
      } else {
        console.log("Disconnected from PLC");
        resolve(true);
      }
    });
  });
};

const readData = (dbNumber, startByte, length) => {
  return new Promise((resolve, reject) => {
    client.DBRead(dbNumber, startByte, length, (err, data) => {
      if (err) {
        console.error("Error reading data from PLC: ", err);
        reject(err);
      } else {
        console.log("Data read from PLC: ", data);
        resolve(data);
      }
    });
  });
};

const writeData = (dbNumber, startByte, data) => {
  return new Promise((resolve, reject) => {
    let buffer;

    // Transformăm datele într-un Buffer
    if (Array.isArray(data)) {
      buffer = Buffer.from(data);
    } else {
      return reject(new Error("Data must be an array"));
    }

    // Verificăm lungimea buffer-ului
    if (buffer.length === 0) {
      return reject(new Error("Buffer is empty"));
    }

    const size = buffer.length;

    // Validăm startByte și size
    if (startByte < 0 || size <= 0) {
      return reject(new Error("Invalid startByte or size"));
    }

    client.DBWrite(dbNumber, startByte, size, 0, buffer, (err) => {
      if (err) {
        console.error("Error writing data to PLC:", err);
        reject(err);
      } else {
        console.log("Data written to PLC successfully");
        resolve(true);
      }
    });
  });
};

module.exports = {
  connectToPlc,
  disconnectFromPlc,
  readData,
  writeData,
};
