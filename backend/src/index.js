import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import featuresRoute from "./routes/routes.features.js";
import authRoute from "./routes/routes.auth.js";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use("/url", featuresRoute);
app.use("/url/auth", authRoute);
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
  connectDB();
});
