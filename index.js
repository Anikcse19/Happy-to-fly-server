const express = require('express')
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1qogd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const packagesCollection = client.db("Travel-Agency").collection("packages");
    const ordersCollection = client.db("Travel-Agency").collection('Orders')

    // get all packages 
    app.get('/homepackages', async (req, res) => {

        const result = await packagesCollection.find({}).toArray()
        res.send(result)

        console.log('hello')
    })

    // get single package 
    app.get('/ordered/:id', async (req, res) => {
        const result = await packagesCollection.find({ _id: ObjectId(req.params.id) }).toArray()
        res.send(result)
    })
    // get only cuurent user orders 

    app.get("/myOrders/:email", (req, res) => {
        console.log(req.params);
        ordersCollection
            .find({ email: req.params.email })
            .toArray((err, results) => {
                res.send(results);
            });
    });
    // update data 
    app.put('/update/:id', (req, res) => {
        console.log(req.params.id)
        console.log(req.body)
        // const id = req.params.id;
        // const updatedName = req.body;
        // const filter = { _id: ObjectId(id) };

        // ordersCollection
        //     .updateOne(filter, {
        //         $set: {
        //             status: updatedName.status,
        //         },
        //     })
        //     .then((result) => {
        //         console.log(result);
        //     });
    })
    // get my orders
    app.get('/orders', async (req, res) => {
        const results = await ordersCollection.find({}).toArray()
        res.send(results)

    })


    // cancel order
    app.delete("/cancelOrder/:id", async (req, res) => {
        console.log(req.params.id);

        ordersCollection
            .deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res.send(result);
            });
    });

    // ordered package post 
    app.post('/myorders/:id', (req, res) => {
        console.log(req.body)
        ordersCollection.insertOne(req.body).then((documents) => {
            res.send(documents.insertedId);
        });

    })

    // add manual package 
    app.post('/homepackages', (req, res) => {
        console.log(req.body)
        packagesCollection.insertOne(req.body).then((documents) => {
            res.send(documents.insertedId);
        });

    })


    // client.close();
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log('My server running at', port)
})