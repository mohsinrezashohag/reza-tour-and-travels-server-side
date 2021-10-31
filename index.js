const express = require('express')
const { MongoClient } = require('mongodb');
var bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectId
const cors = require('cors');
const { response } = require('express');
require('dotenv').config()


const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g008r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



app.get('/', (req, res) => {
    res.send("<h1>Server Running 🟢</h1>")
}
)


async function run() {

    try {

        await client.connect();
        console.log("Database Connected");

        const database = client.db("RezaTravels");
        const packageCollection = database.collection("Packages");
        const ordersCollection = database.collection("orders");

        // get all api (find)
        app.get('/packages', async (req, res) => {
            const packages = await packageCollection.find({}).toArray()
            res.json(packages)
        })

        // find single using id
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const singlePackage = await packageCollection.findOne({ _id: ObjectId(id) })
            res.json(singlePackage)

        })

        // insert One document 
        app.post('/addNewPackage', async (req, res) => {
            const newPackage = req.body;
            const result = await packageCollection.insertOne(newPackage)
            res.send(result);
        })


        // adding booking

        app.post('/addBooking', async (req, res) => {
            const newOrder = req.body;
            const results = await ordersCollection.insertOne(newOrder)
            console.log(newOrder);
            console.log(results);
            res.send(results)

        })

        // adding all booking & orders 
        app.get('/orders', async (req, res) => {
            const results = await ordersCollection.find({}).toArray();
            res.json(results)
        })


        // adding all booking & orders 
        app.put('/order/update/:id', async (req, res) => {
            const id = req.params.id;
            const UpdatedOrder = req.body;
            const options = { upsert: true };

            console.log(id);
            console.log("hitting update", id);
            const results = await ordersCollection.updateOne({ _id: ObjectId(id) }, {
                $set: {
                    Package: UpdatedOrder.Package,
                    bookedBy: UpdatedOrder.bookedBy,
                    price: UpdatedOrder.price,
                    status: UpdatedOrder.status
                }
            }, options);
            res.json(results)
            console.log(results);
        })







        // delete orders
        app.delete('/deleteOrder/:id', async (req, res) => {
            const id = req.params.id;
            const result = await ordersCollection.deleteOne({ _id: ObjectId(id) })
            res.json(result)

        })










    }

    finally {

    }
}

run().catch(console.dir)


app.listen(port, () => {
    console.log(`Port Running : `, port)
}
)