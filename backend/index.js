import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './src/configur/config.js';
import route from "./src/routes/routes.js";
import cors from 'cors';

const app = express();
app.use(express.json());

const allowedOrigins = [
  "https://nxt-mart-eta.vercel.app",
  "https://future-fs-03-iclc-p4w17c3zr-revanth-portfolio.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(cors());
dotenv.config();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error("MongoURI is missing in .env file");
  process.exit(1);
}

async function main() {
  try {
    await connectDB(MONGO_URL);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (e) {
    console.error("Failed to connect:", e.message);
    process.exit(1);
  }
}

main();

app.use("/", route);
