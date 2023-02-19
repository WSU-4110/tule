const express = require('express');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
//!!!All requests made to this server must have body in json format!!!
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

//Route to verify login information. Currently only verifies. Need to add some work on the response with session cookies?
app.post('/LoginVerify', (req,res) => {
    usersCollection.find({Username: req.body.Username}).toArray().then(info => {
        if(info.length == 1){
            if(info[0]['Password'] === req.body.Password){
                res.send("Login Success")
            }
            else{
                res.send("Invalid Password")
            }
        }
        else if(info.length > 1){
            res.send("Warning!! Duplicate usernames exist")
        }
        else{
            res.send("Username not found")
        }
    })
});

//Route to create new user entry in the database
app.post('/AccountCreate', (req,res) => {
    usersCollection.find({Username: req.body.Username}).toArray().then(info => {
        if(info.length == 0){
            usersCollection.insertOne(req.body);
            res.send("Account Created Successfully!")
        }
        else {
            res.send("Username already in use")
        }
    })
});

app.listen(3000, () => console.log('Example app is listening on port 3000.'));