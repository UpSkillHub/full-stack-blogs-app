import app from "./app.js";
import { connectDB } from "./services/db/index.js";
import { config } from "dotenv";
config();

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDB(process.env.DB);
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (error) {
    console.log("ERROR STARTING APP", error);
    process.exit(1);
  }
};

startServer();
