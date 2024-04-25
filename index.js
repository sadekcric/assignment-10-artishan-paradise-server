const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 5000;

// middleware between server site and client side
app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.PASSWORD}@cluster0.1ekltq6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const kachaBazarCollection = client.db("kachaBazarDB").collection("kachaBazar");

    app.post("/products", async (req, res) => {
      const items = req.body;
      const result = await kachaBazarCollection.insertOne(items);
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const cursor = kachaBazarCollection.find();
      const result = await cursor.toArray();

      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const item = await kachaBazarCollection.findOne(query);

      res.send(item);
    });

    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const item = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateItem = {
        $set: {
          name: item.name,
          price: item.price,
          category: item.category,
          details: item.details,
          photo: item.photo,
          stock: item.stock,
        },
      };

      const result = await kachaBazarCollection.updateOne(filter, updateItem, options);

      res.send(result);
    });

    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await kachaBazarCollection.deleteOne(query);

      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);

//server command
app.get("/", (req, res) => {
  res.send("Welcome...The server site is running");
});

app.listen(port, () => {
  console.log(`This site is Running at Port: ${port}`);
});
