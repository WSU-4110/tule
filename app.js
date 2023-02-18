const express = require('express');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
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
    res.send('Successful Login')
})

app.listen(3000, () => console.log('Example app is listening on port 3000.'));