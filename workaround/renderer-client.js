import path from "path";
import { fork } from "child_process";
import { RendererEvent } from "./enums";

export class RendererClient {
  init() {
    return new Promise((resolve) => {
      // Fire up a separate Node process with zone.js and Angular Universal
      this.renderer = fork(path.resolve(__dirname, "renderer.js"), [], {
        stdio: ["inherit", "inherit", "inherit", "ipc"],
        // NOTE This is not good if we ever want to debug the renderer
        execArgv: [],
      });

      // We will be receiving many render requests; this map will help us keep track of them
      this.renderCallbacks = new Map();

      // In my app I use request IDs from express, but a simple counter like this would work too
      this.renderID = -1;

      // Here we react to messages coming from the renderer Node process
      this.renderer.on("message", (message) => {
        switch (message.type) {
          case RendererEvent.HTML:
            this.callRenderCallback(message.id, null, message.data);
            break;
          case RendererEvent.Error:
            this.callRenderCallback(message.id, message.data);
            break;
          case RendererEvent.Ready:
            console.info("Server-side rendering configured");
            resolve();
            break;
          default:
            console.warn("Unexpected message received from the renderer");
        }
      });
    });
  }

  destroy() {
    if (this.renderer) {
      this.renderer.kill();
    }
  }

  sendRenderRequest({ filePath, url, callback }) {
    const id = this.createRenderCallback(callback);

    this.renderer.send({
      id,
      filePath,
      options: {
        url,
      },
    });
  }

  callRenderCallback(id, error, data) {
    const callback = this.renderCallbacks.get(id);
    this.renderCallbacks.delete(id);
    if (callback) {
      callback(error, data);
    } else {
      console.error(`Callback for render ID '${id}' not found`);
    }
  }

  createRenderCallback(callback) {
    this.renderID += 1;
    this.renderCallbacks.set(this.renderID, callback);
    return this.renderID;
  }
}
