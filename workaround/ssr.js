import express from "express";
import { UI_BROWSER_DIR, STATIC_CONTENT_CACHE_DURATION } from "./config";
import { RendererClient } from "./renderer-client";

export default async (app) => {
  console.info("Setting up server-side rendering...");

  const renderer = new RendererClient();

  await renderer.init();

  process.on("exit", () => {
    console.info("Process exit detected, killing the renderer process...");
    renderer.destroy();
  });

  // Define the behavior for the "html" view engine
  // It delegates all rendering to the RendererClient class
  app.engine("html", (filePath, { req }, callback) => {
    renderer.sendRenderRequest({
      filePath,
      // It is crucial that the renderer know which URL to render
      url: `${req.protocol}://${req.get("host") || ""}${req.originalUrl}`,
      callback,
    });
  });

  // Use the defined engine
  app.set("view engine", "html");

  app.set("views", UI_BROWSER_DIR);

  // Serve static assets from the client build directory
  app.get(
    "*.*",
    express.static(UI_BROWSER_DIR, {
      maxAge: STATIC_CONTENT_CACHE_DURATION,
      fallthrough: false,
    })
  );

  // All GET requests are render requests
  app.get("*", (req, res) => {
    res.render("index", { req });
  });
};
