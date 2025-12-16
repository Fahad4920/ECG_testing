const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
  
const app = express();
app.use(express.json());
app.use(cors());

// 🔴 PUT YOUR POSTGRES URL HERE
// const pool = new Pool({
//   connectionString: "postgresql://neondb_owner:npg_QGaWn1jz5PsY@ep-long-bar-antll984.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require",
//   ssl: { rejectUnauthorized: false }
// });

// ===== TEST ROUTE =====
app.get("/", (req, res) => {
  res.send("ECG Server Running");
});

// ===== INSERT ECG DATA =====
app.post("/ecg", async (req, res) => {
  try {
    const { patientId, value } = req.body;

    await pool.query(
      "INSERT INTO ecg_data (patient_id, value) VALUES ($1, $2)",
      [patientId, value]
    );

    res.send("Saved");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

// ===== GET ECG DATA =====
app.get("/ecg/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM ecg_data WHERE patient_id=$1 ORDER BY time DESC LIMIT 300",
      [req.params.id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Error");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));