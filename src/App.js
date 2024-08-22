import React, { useState } from "react";
import {
  connectToPlc,
  disconnectFromPlc,
  readData,
  writeData,
} from "./plcCommunication"; // Importăm funcții pentru comunicația cu PLC-ul

const MAX_AGV = 10; // Ar trebui să fie setat în mod corespunzător
const MAX_PROG = 2; // Ar trebui să fie setat în mod corespunzător

function App() {
  const [status, setStatus] = useState("Disconnected");
  const [programData, setProgramData] = useState([]);
  const [agvNumber, setAgvNumber] = useState(1); // Valoarea implicită pentru AGV
  const [programNumber, setProgramNumber] = useState(1); // Valoarea implicită pentru program

  // Funcția pentru conectarea la PLC
  const handleConnect = async () => {
    const success = await connectToPlc("192.168.1.41", 0, 1); // Exemplu de IP, rack, slot
    if (success) {
      setStatus("Connected");
    } else {
      setStatus("Connection failed");
    }
  };

  // Funcția pentru deconectarea de la PLC
  const handleDisconnect = async () => {
    const success = await disconnectFromPlc();
    if (success) {
      setStatus("Disconnected");
    }
  };

  // Funcția pentru citirea datelor din PLC
  const handleRead = async () => {
    if (status !== "Connected") {
      console.error("Nu ești conectat la PLC!");
      return;
    }

    const nAgv = parseInt(agvNumber, 10);
    const nProg = parseInt(programNumber, 10);

    // Confirmare de citire
    if (
      !window.confirm(
        `Confirmi citirea programului Nr. ${nProg} de la AGV ${nAgv}?`
      )
    ) {
      return;
    }

    try {
      const readBytes = await readData(300, 0, 16); // Citește date din DB 300, adresa de start 0, lungime 16
      setProgramData(readBytes);
      console.log("Read program data: ", readBytes);
    } catch (error) {
      console.error("Error reading data from PLC: ", error);
    }
  };

  // Funcția pentru scrierea datelor în PLC
  const handleWrite = async () => {
    if (status !== "Connected") {
      console.error("Nu ești conectat la PLC!");
      return;
    }

    const dataToWrite = programData.map(
      (item) => parseInt(item.value, 10) || 0
    ); // Transformarea valorilor la integer

    try {
      const success = await writeData(300, 0, dataToWrite); // Scrie în PLC
      if (success) {
        console.log("Write successful");
      }
    } catch (error) {
      console.error("Error writing data to PLC: ", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>PLC Communication</h1>
      <p>Status: {status}</p>
      <button onClick={handleConnect}>Connect to PLC</button>
      <button onClick={handleDisconnect}>Disconnect from PLC</button>
      <button onClick={handleRead}>Read Data</button>
      <button onClick={handleWrite}>Write Data</button>

      <div>
        <h2>Input AGV Number:</h2>
        <input
          type="number"
          min="1"
          max={MAX_AGV}
          value={agvNumber}
          onChange={(e) => setAgvNumber(e.target.value)}
        />
      </div>

      <div>
        <h2>Input Program Number:</h2>
        <input
          type="number"
          min="1"
          max={MAX_PROG}
          value={programNumber}
          onChange={(e) => setProgramNumber(e.target.value)}
        />
      </div>

      <h2>Program Data:</h2>
      <pre>{JSON.stringify(programData, null, 2)}</pre>
    </div>
  );
}

export default App;
