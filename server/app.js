const express = require('express');
require('dotenv').config();
const cors = require('cors');
const ScheduleGenerator = require('./ScheduleGenerator');
const DbHandler = require('./DbHandler')

const app = express();
const scheduleGenerator = new ScheduleGenerator();
const dbHandler = new DbHandler();
//!!!All requests made to this server must have body in json format!!!
app.use(express.json());
app.use(cors());
app.use((req, res, next) =>{
    res.set({"Access-Control-Allow-Origin":"*","Content-Type":'application/json'});
    next();
})

//Route to verify login information. Currently only verifies. Need to add some work on the response with session cookies?
app.post('/LoginVerify', async (req,res) => {
    res.send(await dbHandler.loginVerify(req));
});

//Route to create new user entry in the database
app.post('/AccountCreate', async (req,res) => {
    res.send(await dbHandler.accountCreate(req));
});

app.post('/GetAllTasks', async (req, res) => {
    res.send(await dbHandler.getUserTasksVerbose(req));
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
app.post('/SaveTask', async (req,res) => {
    res.send(await dbHandler.saveTask(req));
})

app.post('/CreateSchedule', async (req,res) =>{
    const tasks = dbHandler.getUserTasksVerbose(req);
    const newSchedule = taskHandler.generateSchedule(await tasks)
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

    app.post('/CreateSchedule', (req,res) =>{

    })


app.listen(3001, () => console.log('Example app is listening on port 3001.'));
