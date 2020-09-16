// Importing the problematic dependency
require("zone.js/dist/zone-node");

const path = require("path");
const { enableProdMode } = require("@angular/core");
const { ngExpressEngine } = require("@nguniversal/express-engine");
const {
  provideModuleMap,
} = require("@nguniversal/module-map-ngfactory-loader");

// This is the Angular Universal file
const SSR_ENTRY_FILE = "dist/ssr/main";

const RendererEvent = {
  Ready: "ready",
  HTML: "html",
  Error: "error",
};

// Just a standard Angular Universal setup below
const { AppSSRModuleNgFactory, LAZY_MODULE_MAP } = require(path.resolve(
  SSR_ENTRY_FILE
));

enableProdMode();

const renderEngine = ngExpressEngine({
  bootstrap: AppSSRModuleNgFactory,
  providers: [provideModuleMap(LAZY_MODULE_MAP)],
});

// This is where the process reacts to render requests from the client!
process.on("message", (message) => {
  if (message.filePath) {
    renderEngine(message.filePath, message.options, (error, html) => {
      if (error) {
        process.send({
          id: message.id,
          type: RendererEvent.Error,
          data: error,
        });
      } else {
        process.send({
          id: message.id,
          type: RendererEvent.HTML,
          data: html,
        });
      }
    });
  }
});

// A timeout keeps the process alive, otherwise it would exit immediately
setInterval(() => {
  console.log("This timer keeps the process running");
}, 1000 * 60 * 60 * 24);

// Tell the client that we're ready to receive render requests
process.send({
  type: RendererEvent.Ready,
});
