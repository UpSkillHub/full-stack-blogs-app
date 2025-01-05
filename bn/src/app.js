import express from "express";
import routes from "./routes/index.js";
import errorHandler from "./utils/errorHandler.js";
import cors from "cors";
import session from "express-session";

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: "auto", httpOnly: true, maxAge: 1000 * 60 * 60 * 24 },
  })
);
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routes);
app.use("*", async (req, res) => {
  res.sendStatus(200);
});
app.use(errorHandler);
export default app;
