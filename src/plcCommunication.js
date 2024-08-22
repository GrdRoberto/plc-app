import axios from "axios";

const apiUrl = "http://localhost:5000"; // Adjust accordingly

export const connectToPlc = async (ip, rack, slot) => {
  try {
    const response = await axios.post(`${apiUrl}/connect`, { ip, rack, slot });
    return response.data.success;
  } catch (error) {
    console.error("Error connecting to PLC: ", error);
    return false;
  }
};

export const disconnectFromPlc = async () => {
  try {
    const response = await axios.post(`${apiUrl}/disconnect`);
    return response.data.success;
  } catch (error) {
    console.error("Error disconnecting from PLC: ", error);
    return false;
  }
};

export const readData = async (dbNumber, startByte, length) => {
  try {
    const response = await axios.post(`${apiUrl}/read`, {
      dbNumber,
      startByte,
      length,
    });
    if (response.data && response.data.success) {
      return response.data.data; // Ensure this corresponds to the structure you expect.
    } else {
      console.error("Failed to read data from PLC: ", response.data.message);
      throw new Error(response.data.message || "Failed to read data from PLC");
    }
  } catch (error) {
    console.error("Error reading data from PLC: ", error);
    throw error; // Rethrow to handle in the calling function
  }
};

export const writeData = async (dbNumber, startByte, data) => {
  try {
    const response = await axios.post(`${apiUrl}/write`, {
      dbNumber,
      startByte,
      data,
    });
    return response.data.success;
  } catch (error) {
    console.error("Error writing data to PLC: ", error);
    return false;
  }
};
