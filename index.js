const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongo db settings
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5732rtt.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const packageCollection = client.db("travelGoDB").collection("packages");
    const tourCollection = client.db("travelGoDB").collection("tours");
    const reviewCollection = client.db("travelGoDB").collection("reviews");
    const bookingCollection = client.db("travelGoDB").collection("bookings");

    // packages get method
    app.get("/packages", async (req, res) => {
      const result = await packageCollection
        .find(
          {},
          {
            projection: {
              img: 1,
              country: 1,
              place: 1,
              countryCode: 1,
              duration: 1,
              people: 1,
              price: 1,
              desc: 1,
            },
          }
        )
        .toArray();
      res.send(result);
    });

    // packages get method by id
    app.get("/packages/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await packageCollection.findOne(query);
      res.send(result);
    });

    // packages post method
    app.post("/packages", async (req, res) => {
      const newPackage = req.body;
      const result = await packageCollection.insertOne(newPackage);
      res.send(result);
    });

    // tours get method
    app.get("/tours", async (req, res) => {
      const result = await tourCollection.find().toArray();
      res.send(result);
    });

    // reviews get method
    app.get("/reviews", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });

    // all bookings get method
    app.get("/allBookings", async (req, res) => {
      const result = await bookingCollection.find({}).toArray();
      res.send(result);
    });

    // bookings by email query get method
    app.get("/bookings", async (req, res) => {
      const query = req.query;
      const result = await bookingCollection
        .find({ email: query.email })
        .toArray();
      res.send(result);
    });

    // booking post method
    app.post("/bookings", async (req, res) => {
      const body = req.body;
      const result = await bookingCollection.insertOne(body);
      res.send(result);
    });

    // booking patch method
    app.patch("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const updatedBooking = {
        $set: {
          confirm: req.body.confirm,
        },
      };
      const result = await bookingCollection.updateOne(
        { _id: new ObjectId(id) },
        updatedBooking
      );
      res.send(result);
    });

    // booking delete method
    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const result = await bookingCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Travel Go Server is running.");
});

app.listen(port, () => {
  console.log("Travel Go server is running on port: ", port);
});
