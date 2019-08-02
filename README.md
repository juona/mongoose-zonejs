# Mongoose and Zone.js
A demonstration of how Mongoose does not work well with Zone.js

# Usage

Run ```npm run test``` and provide a mongo connection URL, e.g.:

```
npm run test mongodb://localhost:27017,localhost:27018,localhost:27019/podbase?replicaSet=rs0
```

The program accepts the following parameters:

- ```use-zone-js``` - load [Zone.js](https://www.npmjs.com/package/zone.js) at the beginning of the application (```require("zone.js/dist/zone-node")```).
- ```use-mongoose``` - use [Mongoose](https://www.npmjs.com/package/mongoose) to connect to MongoDB. If this parameter is skipped, the official [MongoDB driver](https://www.npmjs.com/package/mongodb) will be used.

Thus there are four possible ways to run this application:

1. Without Zone.js, with the official driver.
2. Without Zone.js, with Mongoose.
3. With Zone.js, with the official driver.
4. **With Zone.js, with Mongoose** (this is the scenario which does not always work).

There is a specific case when scenario #4 does not work - that's when I try to connect to an [Atlas](https://cloud.mongodb.com) cluster.

For testing purposes I have created a user with access to a certain database in my test cluster:

- ```test-user```
- ```UaFRNke93P7PzwXu```

Use the following URL:

```mongodb+srv://test-user:UaFRNke93P7PzwXu@podbase-test-rhc1v.azure.mongodb.net/test-mongoose?retryWrites=true&w=majority```

The scenario which does not work as expected is reproduced using this command:

```npm run test mongodb+srv://test-user:UaFRNke93P7PzwXu@podbase-test-rhc1v.azure.mongodb.net/test-mongoose?retryWrites=true&w=majority use-zone-js use-mongoose```