import express from "express";
import setupSSR from "./ssr";

console.info("Creating an Express app...");

const PORT = 3000;

const app = express();

setupSSR(app).then(() =>
  app.listen(PORT, () => {
    console.info(`Server started on port ${PORT}`);
  })
);
