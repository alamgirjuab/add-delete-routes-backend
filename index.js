const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

/*------------- 
 | Middleware |
 -------------*/
app.use(cors());
app.use(express.json());

/*------------------------- 
| Database Configuration |
-------------------------*/

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gi8q3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {

    /*----------------------
     | Database Connection |
     ---------------------*/

    await client.connect();
    // console.log('database connected successfully');
    const database = client.db("zigyPrints");
    const routes = database.collection("addDeleteRoutes");

    /*----------
     | GET API |
     ---------*/
    app.get("/addusers", async (req, res) => {
        const cursor = routes.find({});
        const allPhones = await cursor.toArray();
        res.send(allPhones);
    });

    /*------------------ 
     | DATA DELETE API |
     ------------------*/
    app.delete('/addusers/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await routes.deleteOne(query);
        res.json(result);

    })
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Gizy Prints!');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});