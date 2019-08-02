const cmdArgs = process.argv.slice(2);

const mongoURI = cmdArgs.shift();

const exit = () => {
  console.log("Finished application");
  process.exit(0);
};

if (!mongoURI) {
  console.log("Mongo URI is required!");
  process.exit(1);
}

if (cmdArgs.includes("use-zone-js")) {
  require("zone.js/dist/zone-node");
}

if (cmdArgs.includes("use-mongoose")) {
  const mongoose = require("mongoose");

  mongoose.connect(mongoURI, {
    useNewUrlParser: true
  });

  mongoose.connection.once("open", () => {
    console.log("Connection open!");

    console.log("Closing the client...");

    mongoose.disconnect();

    exit();
  });

  mongoose.connection.on("error", err => {
    console.log("Unable to connect to the database");
    console.log(err.stack);
    exit();
  });
} else {
  const MongoClient = require("mongodb").MongoClient;

  // Use connect method to connect to the server
  MongoClient.connect(
    mongoURI,
    {
      useNewUrlParser: true
    },
    (err, client) => {
      if (err) {
        console.log("Unable to connect to the database");
        console.log(err.stack);
        exit();
      }

      console.log("Connection open!");

      console.log("Closing the client...");

      client.close();

      exit();
    }
  );
}
