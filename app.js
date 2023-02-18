const express = require('express');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
//All requests made to this server must have body in json format!!!
app.use(express.json());
const uri = process.env.MONGO_CONNECTION;
console.log(uri);
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
};

//create mongodb client with options from above
let client = new MongoClient(uri, mongoOptions);

client.connect();


const db = client.db('Tule');
const usersCollection = db.collection('Users')
const tasksCollection = db.collection('Tasks')

app.post('/LoginVerify', (req,res) => {
    console.log(req.body);

    const userInfo = usersCollection.find({Username: req.body['Username']}).toArray()
    console.log(userInfo)
    res.send('Successful Login');
})

app.listen(3000, () => console.log('Example app is listening on port 3000.'));