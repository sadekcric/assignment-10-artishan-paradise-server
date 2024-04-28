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

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const artAndCraftCollection = client.db("artAndCraftDB").collection("artAndCraft");

    app.post("/products", async (req, res) => {
      const items = req.body;
      const result = await artAndCraftCollection.insertOne(items);
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const cursor = artAndCraftCollection.find();
      const result = await cursor.toArray();

      res.send(result);
    });

    app.get("/products-category/:category", async (req, res) => {
      const userCategory = req.params.category;
      const query = { category: userCategory };
      const result = await artAndCraftCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const item = await artAndCraftCollection.findOne(query);

      res.send(item);
    });

    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const item = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateItem = {
        $set: {
          name: item.name,
          price: item.price,
          category: item.category,
          rating: item.rating,
          customization: item.customization,
          stock: item.stock,
          details: item.details,
          photo: item.photo,
          processingTime: item.processingTime,
        },
      };

      const result = await artAndCraftCollection.updateOne(filter, updateItem, options);

      res.send(result);
    });

    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await artAndCraftCollection.deleteOne(query);

      res.send(result);
    });

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
