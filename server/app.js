const express = require('express');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
//!!!All requests made to this server must have body in json format!!!
app.use(express.json());
//Calling the mongodb connection string from .env so it isn't exposed on github
const uri = process.env.MONGO_CONNECTION;
//Setting some standard suggested options
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
};

//Mongodb doc https://www.mongodb.com/docs/drivers/node/current/
//Fundamentals section will be your friend

//create mongodb client with options from above
let client = new MongoClient(uri, mongoOptions);
//establish connection with database
client.connect();
//select database
const db = client.db('Tule');
//create connection to each collection for use in routes
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

app.post('/GetAllTasks', (req, res) => {
    usersCollection.find({ Username: req.body.Username }).toArray().then(info => {
        // populate a list with all IDs from info.activeTasks, info.inactiveTasks, info.recurringTasks, info.schedules
        var tasksList = {};
        
        tasksCollection.find({  $set: { "_id": info.ActiveTasks} }).toArray().then(info => {
            tasksList["ActiveTasks"] = info;
        })


        tasksCollection.find({ $set:{"_id":info.InactiveTasks} }).toArray().then(info=> {
            tasksList["InactiveTasks"] = info;
        })

        tasksCollection.find({ $set: {"_id": info.recurringTasks} }).toArray().then(info=> {
            tasksList["RecurringTasks"] = info; 
        })
        
        tasksList["Schedules"] = info.Schedules;

        res.send(tasksList);  
    

    })
});

app.listen(3000, () => console.log('Example app is listening on port 3000.'));