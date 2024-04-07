import express from "express";
import {
  addMedicine,
  getMedicineByName,
  getMedicineExpireAt,
} from "./services/medicine.js";

const app = express();
app.use(express.json());

app.post("/api/medicines/import", (req, res) => {
  var medicineList = req.body;
  addMedicine(medicineList);
  res.json({ Message: "Success" });
});

app.get("/api/medicines", async (req, res) => {
  var query = req.query.name;
  var response = await getMedicineByName(query);
  res.status(response.statusCode).json(response.result);
});

app.get("/api/medicines/expired", async (req, res) => {
  var now = Date.now();
  var response = await getMedicineExpireAt(now);
  res.status(response.statusCode).send(response.result);
});

app.get("/api/medicines/expire-at", async (req, res) => {
  var timestamp = req.query?.timestamp;
  if (!timestamp) {
    return res
      .status(400)
      .json({ Message: "Please add timestamp to query of the request" });
  }
  var response = await getMedicineExpireAt(timestamp);
  res.status(response.statusCode).send(response.result);
});

app.listen(3000, () => {
  console.log("App's running on port 3000");
});
