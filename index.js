const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express");
const cors = require('cors')
const app = express();
require("dotenv").config();
const port = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors());

const uri =
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.g0ilve4.mongodb.net/?appName=Cluster0`;

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
    
    const db = client.db('flavorVault')
    const recipesCollection = db.collection('recipes')

    app.get('/recipes',async(req,res)=>{
        const email = req.query.email 
        const query = {}
        if(email){
            query.recipeMakerEmail= email
        }
        const result = await recipesCollection.find(query).toArray()
        res.send(result)
    })


    app.get('/recipes/:id',async(req,res)=>{
        const id = req.params.id 
        const query = {_id: new ObjectId(id)}
        const result = await recipesCollection.findOne(query)
        res.send(result)
    })









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
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
