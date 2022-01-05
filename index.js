const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const app = express();

const port = 5000;

app.use(cors())
app.use(express.json())

const uri = "mongodb+srv://node-second:nodeSecond@cluster0.e2tj6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

app.get('/', (req, res) => {
    res.send('hello world');
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("second-node");
        const userCollection = database.collection("user");

        /// get date find >>>>> multifole find
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        /// find one
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await userCollection.findOne(query);
            res.json(user);
        })

        /// update one
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: user.name,
                    email: user.email
                },
            };

            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })
        // delete one
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.json(result);
        })

        //post data inset one
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            res.json(result);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log('listing to port', port);
})