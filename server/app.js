const express = require('express');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();

//!!!All requests made to this server must have body in json format!!!
app.use(express.json());
app.use(cors());
//Calling the mongodb connection string from .env so it isn't exposed on github
const uri = process.env.MONGO_CONNECTION;
//console.log('uri: ',uri);
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
    frontRes = {}
    res.set('Access-Control-Allow-Origin', '*');
    console.log(req.body.Username);
    console.log(req.body.Password);
    usersCollection.find({Username: req.body.Username}).toArray().then(info => {
        res.set({'Content-Type':'application/json'});
        if(info.length == 1){
            if(info[0]['Password'] === req.body.Password){                
                res.send({"LoginSuccess":"True"});
            }
            else{
                res.send({"LoginSuccess":"False"});
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
        console.log('test')
        console.log(info);
        frontRes = {};
        res.set({"Access-Control-Allow-Origin":"*","Content-Type":'application/json'});
        if(info.length == 0){
            usersCollection.insertOne(req.body);
            console.log(req.body);
            frontRes["AccountCreate"] = "True";
            res.send(frontRes)
        }
        else {
            frontRes["AccountCreate"] = "False";
            res.send(frontRes)
        }
    })
});

app.post('/GetAllTasks', (req, res) => {
    console.log('in getAllTasks ', req.body.Username);
    console.log(req.body.Password);
    usersCollection.find({ Username: req.body.Username }).toArray().then(info => {
        console.log('passed find operation', info);
        console.log('active tasks', info[0].ActiveTasks);
        console.log('inactive tasks', info[0].InactiveTasks);
        console.log('recurring', info[0].RecurringTasks);
        // populate a list with all IDs from info.activeTasks, info.inactiveTasks, info.recurringTasks, info.schedules
        var tasksList = {};
        if(info[0].ActiveTasks.length > 0){
            tasksCollection.find({"_id": {$in: info[0].ActiveTasks} }).toArray().then(info => {
                console.log('tasksCollection return active', info);
                tasksList["ActiveTasks"] = info;
            })
        }
        else{
            tasksList["ActiveTasks"] = [];
        }

        if(info[0].InactiveTasks.length > 0){
            tasksCollection.find({"_id": {$in: info[0].InactiveTasks} }).toArray().then(info=> {
                console.log('tasksCollection return inactive', info);
                tasksList["InactiveTasks"] = info;
            })
        }
        else{
            tasksList["InactiveTasks"] = [];
        }

        if(info[0].RecurringTasks.length > 0){
            tasksCollection.find({"_id": {$in: info[0].RecurringTasks} }).toArray().then(info=> {
                console.log('tasksCollection return recurring', info);
                tasksList["RecurringTasks"] = info; 
            })
        }
        else{
            tasksList["RecurringTasks"] = [];
        }
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

//Need to pass a complete task in body.Task 
//Task format is defined in google doc currently
//If new task then pass "" as "Id" field
//body.Username, and body.Password fields need to be provided as well. 
//Probably need to generate a new schedule after this.
app.post('SaveTask', (req,res) => {
    var task = req.body.Task;
    if (task.Id != ""){
        var tempId = new ObjectId(task.Id)
        tasksCollection.replaceOne({"_id":tempId},task).toArray().then(info => {
            usersCollection.find({"Username":req.body.Username}).toArray().then(user =>{
                let recKeyList = Object.keys(task['Recurrence']);
                let recFlag = false;
                for (var i = 0; i < user['RecurringTasks'].length; i++){
                    if (String(user['RecurringTasks'][i]) == String(tempId)){
                        user['RecurringTasks'].splice(i,1);
                        break;
                    }
                }
                for(var i = 0; i  < user['InactiveTasks'].length; i++){
                    if (String(user['InactiveTasks'][i]) == String(tempId)){
                        user['InactiveTasks'].splice(i,1);
                        break;
                    }
                }
                for (var i = 0; i < recKeyList.length; i++){
                    if (task['Recurrence'][recKeyList[i]]){
                        user['RecurringTasks'].push(tempId);
                        recFlag = true;
                        break;
                    }
                }
                if (recFlag == false){
                    user['InactiveTasks'].push(tempId);

                }
                usersCollection.replaceOne({"_id":user["_id"]},user);
                //check for completion of replace???
            })
        })
        res.json(task);
    }
    else {
        tasksCollection.insertOne(task).then(info => {
            task.Id = String(info.Id);
            res.json(task);
        })
    }
})


app.post('/DeleteTask', (req, res) => { // search userCollection.find, iterate all tasks and look for ID, remove ID. do the same to taskCollection
    usersCollection.find({ Username: req.body.Username }).toArray().then(user => {


        var tasktobeDeleted = req.body.Task;

        // use POSTman



        for (var i = 0; i < user[InactiveTasks].length; i++) {
            if (user['InactiveTasks'][i] === tasktobeDeleted) { // how to compare only the "_id" info from the Task passed in the req?
                user['InactiveTasks'].splice(i, 1);
            }
        }


        for (var i = 0; i < user[ActiveTasks].length; i++) {
            if (user['ActiveTasks'][i] === tasktobeDeleted) {
                user['ActiveTasks'].splice(i, 1);
            }
        }


        for (var i = 0; i < user[RecurringTasks].length; i++) {
            if (user['RecurringTasks'][i] === tasktobeDeleted) {
                user['RecurringTasks'].splice(i, 1);
            }
        }


        for (var i = 0; i < user[Schedules].length; i++) {
            if (user['Schedules'][i] === tasktobeDeleted) {
                user['Schedules'].splice(i, 1);
            }
        }

        tasksCollection.deleteOne(tasktobeDeleted);

        })
    });



app.listen(3001, () => console.log('Example app is listening on port 3001.'));
