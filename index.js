// import static com.mongodb.client.model.Sorts.descending;
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        const likedRecipesCollection = client.db('recipesDB').collection('likedRecipes')

        app.get('/recipes/main', async (req, res) => {
            const result = await recipesCollection.find().sort({ 'likeCount': -1 }).limit(6).toArray();
            res.send(result)
        })

        app.get('/recipes/all', async (req, res) => {
            const result = await recipesCollection.find().toArray();
            res.send(result)
        })

        app.get('/recipes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await recipesCollection.findOne(query);
            res.send(result)
        })

        app.post('/recipes', async (req, res) => {
            const newRecipes = req.body;
            const result = await recipesCollection.insertOne(newRecipes);
            res.send(result)
        })

        app.patch('/recipes/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedRecipe = req.body;
            const updateDoc = {
                $set: {
                    likeCount: updatedRecipe.likeCount
                },
            };
            const result = await recipesCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        app.put('/recipes/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedRecipe = req.body;
            const options = { upsert: true };
            const updateDoc = {
                $set: updatedRecipe,
            };
            const result = await recipesCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        app.delete('/recipes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await recipesCollection.deleteOne(query);
            res.send(result);
        })

        app.get('/recipes/likedRecipes', async (req, res) => {
            const result = await likedRecipesCollection.find().toArray();
            res.send(result)
        })

        app.post('/recipes/likedRecipes', async (req, res) => {
            const likedRecipe = req.body;
            const result = await likedRecipesCollection.insertOne(likedRecipe);
            res.send(result)
        })

        app.delete('/recipes/likedRecipes', async (req, res) => {
            const { recipeId, userId } = req.body;
            const query = { recipeId: recipeId, userId: userId };
            const result = await likedRecipesCollection.deleteOne(query);
            res.send(result);
        });
        // Send a ping to confirm a successful connection

        // await client.connect();
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log('Recipe server is running on port:', port);
})