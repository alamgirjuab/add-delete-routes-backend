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
    app.get("/products", async (req, res) => {
        const cursor = routes.find({});
        const allPhones = await cursor.toArray();
        res.send(allPhones);
    });

    /*---------------------- 
     | SINGLE DATA GET API |
     ----------------------*/
    app.get("/products/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await routes.findOne(query);
        res.send(result);
    })

    /*----------------
     | DATA POST API |
     ----------------*/
    app.post('/products', async (req, res) => {
        const data = req.body;
        console.log('hit the post api', data);
        const result = await routes.insertOne(data);
        console.log(result);
        res.json(result);
    });

    /*------------------ 
     | DATA DELETE API |
     ------------------*/
    app.delete('/products/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await routes.deleteOne(query);
        res.json(result);

    })

    /*---------------------------- 
     | PUT API (DATA UPDATE API) |
     ----------------------------*/

    app.put('/products/:id', async (req, res) => {
        const id = req.params.id;
        console.log('updating user', id);
        // res.send('update not user')
        const updateService = req.body;
        console.log(updateService);
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                brand_name: updateService.brand_name,
                model: updateService.model,
                ram: updateService.ram,
                internal_storage: updateService.internal_storage,
                screen_size: updateService.screen_size,
                image: updateService.image,
                spec: updateService.spec,
                price: updateService.price
            },
        };
        const result = await routes.updateOne(filter, updateDoc, options);
        // console.log()
        res.json(result)
    })
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});