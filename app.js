const express = require('express');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
app.use(express.json());
const uri = process.env.MONGO_CONNECTION;
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
};

//create mongodb client with options from above
const client = new MongoClient(uri, mongoOptions);
client.connect;

app.post('/LoginVerify', (req,res) => {
    console.log(req.body);
    res.send('Successful Login');
})

app.listen(3000, () => console.log('Example app is listening on port 3000.'));