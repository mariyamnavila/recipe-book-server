const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster033.bpxhzqh.mongodb.net/?appName=Cluster033`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// recipe-book
// rsZyoVN7nucJV6J1

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Recipe server in running')
})

async function run() {
    try {
        const recipesCollection = client.db('recipesDB').collection('recipes')
        app.post('/recipes', async (req, res) => {
            const newRecipes = req.body;
            const result = await recipesCollection.insertOne(newRecipes);
            res.send(result)
        })
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log('Recipe server is running on port:', port);
})