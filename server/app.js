const express = require('express');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
//!!!All requests made to this server must have body in json format!!!
app.use(express.json());
//Calling the mongodb connection string from .env so it isn't exposed on github
const uri = process.env.MONGO_CONNECTION;
console.log('uri: ',uri);
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

//This route needs to be sent the new schedule in body.Schedule according to the format:
/*  {
        <scheduleId> :{
            "Tasks":[{"Id":<int64>, "StartTime":<String>(XX:XX)},...],
            "SchedStart":<string>(XX:XX),
            "SchedStop":<String>(XX:XX)
        }
    }
*/
//Recurring tasks need different behavior
app.post('/AltTask', (req,res) => {
    var newSched = req.body.Schedule;
    schedId = Object.keys(newSched);
    schedId = schedId[0];
    var taskList = req.body.Schedule[schedId]['Tasks'];
    var newIdList = []
    for(var i = 0; i < taskList.length; i++){
        newIdList.push(taskList[i]['Id'])
    }
    console.log(taskList);
    console.log(newIdList);
    usersCollection.find({Username : req.body.Username}).toArray().then(info => {
        console.log('INFO: ', info);
        oldSched = info[0]['Schedules'][schedId]['Tasks'];
        var oldIdList = [];
        for(var i = 0; i < oldSched.length; i++){
            oldIdList.push(oldSched[i]['Id'].toString());
        }
        console.log(oldIdList);
        //Swap inactive to active
        for(var i = 0; i < newIdList.length; i++){
            if(!oldIdList.includes(newIdList[i])){
                console.log('Found id in newlist not in oldlist');
                let object = new ObjectId(newIdList[i]);
                info[0]['ActiveTasks'].push(object);
                let inactive = info[0]['InactiveTasks'];
                var index = 0;
                while(inactive[index].toString() != newIdList[i]){
                    index++
                }
                info[0]['InactiveTasks'].splice(index,1);
            }
        }
        //Swap active to inactive
        for(var i = 0; i < oldIdList.length; i++){
            if(!newIdList.includes(oldIdList[i])){
                console.log('Found id in oldList not in newlist');
                let object = new ObjectId(oldIdList[i]);
                info[0]["InactiveTasks"].push(object);
                let active = info[0]['ActiveTasks'];
                var index = 0;
                while(active[index].toString() != oldIdList[i]){
                    index++
                }
                info[0]['ActiveTasks'].splice(index,1);
            }
        }
        //Update schedule to new schedule
        info[0]['Schedules'][schedId] = newSched[schedId];
        usersCollection.replaceOne({"_id":info[0]['_id']},info[0])
        res.send('working?')
    })
})

app.listen(3000, () => console.log('Example app is listening on port 3000.'));