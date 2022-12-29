const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
// verify jwt
// function verifyJWT(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(401).send([]);
//   }
//   const token = authHeader.split(" ")[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
//     if (err) {
//       return res.status(403).send([]);
//     }
//     req.decoded = decoded;
//     next();
//   });
// }
// middleware end
// mongodb start
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ibovumw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// body start
async function run() {
  try {
    const userCollection = client.db("todo").collection("users");
    const tasksCollection = client.db("todo").collection("tasks");
    // main
    // post user
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    // get user
    app.get("/user/availability", async (req, res) => {
      const email = req.query.email;
      const query = { email };
      const result = await userCollection.find(query).toArray();
      res.send(result);
    });
    // post a task
    app.post("/task", async (req, res) => {
      const task = req.body;
      const result = await tasksCollection.insertOne(task);
      res.send(result);
    });

    // update task title
    app.patch("/task/title", async (req, res) => {
      const body = req.body;
      const id = req.query.id;
      const filter = { _id: ObjectId(id) };
      const updatedDocument = {
        $set: body,
      };
      const result = await tasksCollection.updateOne(filter, updatedDocument);
      res.send(result);
    });
    // update task details
    app.patch("/task/details", async (req, res) => {
      const body = req.body;
      const id = req.query.id;
      const filter = { _id: ObjectId(id) };
      const updatedDocument = {
        $set: body,
      };
      const result = await tasksCollection.updateOne(filter, updatedDocument);
      res.send(result);
    });
    // update task comment
    app.patch("/task/comment", async (req, res) => {
      const body = req.body;
      const id = req.query.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDocument = {
        $set: body,
      };
      const result = await tasksCollection.updateOne(
        filter,
        updatedDocument,
        options
      );
      res.send(result);
    });
    // get pending tasks with email
    app.get("/alltasks", async (req, res) => {
      const email = req.query.email;
      const query = { email: email, status: "pending" };
      const result = await tasksCollection.find(query).toArray();
      res.send(result);
    });
    // get completed tasks with email
    app.get("/completedtasks", async (req, res) => {
      const email = req.query.email;
      const query = { email: email, status: "completed" };
      const result = await tasksCollection.find(query).toArray();
      res.send(result);
    });
    // delete a task
    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await tasksCollection.deleteOne(filter);
      res.send(result);
    });
    // update task status to completed
    app.patch("/task/status", async (req, res) => {
      const id = req.query.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDocument = {
        $set: {
          status: "completed",
        },
      };
      const result = await tasksCollection.updateOne(
        filter,
        updatedDocument,
        options
      );
      res.send(result);
    });
    // update task status to incomplete
    app.patch("/task/status/in", async (req, res) => {
      const id = req.query.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDocument = {
        $set: {
          status: "pending",
        },
      };
      const result = await tasksCollection.updateOne(
        filter,
        updatedDocument,
        options
      );
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.log);
// body end

app.get("/", async (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log("Port is running on", port);
});
