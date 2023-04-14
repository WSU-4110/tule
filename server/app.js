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
app.post('/AltTask', async (req,res) => {
    res.send(await dbHandler.altTask(req));
})

//Need to pass a complete task in body.Task 
//Task format is defined in google doc currently
//If new task then pass "" as "Id" field
//body.Username, and body.Password fields need to be provided as well. 
//Probably need to generate a new schedule after this.
app.post('/SaveTask', async (req,res) => {
    console.log(req.body)
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
            if (user['InactiveTasks'][i] == tasktobeDeleted) { // how to compare only the "_id" info from the Task passed in the req?
                user['InactiveTasks'].splice(i, 1);
            }
            break;
        }


        for (var i = 0; i < user[ActiveTasks].length; i++) {
            if (user['ActiveTasks'][i] == tasktobeDeleted) {
                user['ActiveTasks'].splice(i, 1);
            }
            break;
        }


        for (var i = 0; i < user[RecurringTasks].length; i++) {
            if (user['RecurringTasks'][i] == tasktobeDeleted) {
                user['RecurringTasks'].splice(i, 1);
            }
            break;
        }


        for (var i = 0; i < user[Schedules].length; i++) {
            if (user['Schedules'][i] == tasktobeDeleted) {
                user['Schedules'].splice(i, 1);
            }
            break;
        }

        tasksCollection.deleteOne(tasktobeDeleted);

        })
    });

    app.post('/CreateSchedule', (req,res) =>{

    })

    app.post('/PauseTask', (req, res) => {
       
        usersCollection.find({ Username: req.body.Username }).toArray().then(user => {


            var pausedTask = req.body.Task;
         
         
            var today = new Date();
            var currentTime = today.getHours() + ":" + today.getMinutes(); // retrieve the current time
           
           
            let taskStartTimeKeys = Object.keys(pausedTask['StartTime']); // set keys of task's StartTime (its boolean 'Active' status & its starting time) to a variable
           
           
            var pausedtaskStartTimeHour = (pausedTask['StartTime'][taskStartTimeKeys[1]]).slice(0,2); // set  hour value of start time of pausedTask as a var
            // ^ I sliced above so i could keep only the first 2 characters of the Start Time string (the hour value)
         
         
            var pausedtaskStartTimeMinute = (pausedTask['StartTime'][taskStartTimeKeys[1]]).slice(-2); // set minute value of start time of pausedTask as a var
            // ^ I sliced above so i could keep only the last 2 characters of the Start Time string (the minute value)
           
           
            var newDurationHour = pausedTask['Duration'] - (today.getHours() - parseInt(pausedtaskStartTimeHour)); // previous duration hours Minus how much hours was spent on task
            // take current minute(). subtract starttime minutes from this. divide by 60. add to newduration hour
           
           
            var newDurationMinutestoHours = (today.getMinutes() - parseInt(pausedtaskStartTimeMinute)) / 60;


            newDurationHour = newDurationHour + newDurationMinutestoHours;
            // ^ example for above lines of code: StartTime 4:30. Current time 6:15. (Line 282): Duration 4 hours. 4 - (6 - 4) = 2. (Line 286): 15 - 30 = -15. divide 60 = -15/60. 2 + -15/60 = 1.75 => 4 - 1.75 hours = 2.25 hours new remaining duration.
       
            for (var i = 0; i < user[ActiveTasks].length; i++) { // delete task from active
                if (user['ActiveTasks'][i] == pausedTask._id) {
                    user['ActiveTasks'].splice(i, 1);
                }
                break;
            }
           
            for (var i = 0; i < user[Schedules].length; i++) { // delete task from schedule
                if (user['Schedules'][i] == pausedTask._id) {
                    user['Schedules'].splice(i, 1);
                }
                break;
            }


           
            user['InactiveTasks'].push(pausedTask._id); // move task to inactive


           
            // pausedTask['StartTime']['Active'] = false; <-- i didn't think this was right so i went with the below implementation


            tasksCollection.updateOne({ "_id": pausedTask._id } , // change Active value of task under "StartTime" to false
            {
                "$set": {
                    "StartTime.Active" : false
                }
            }
            )


            // Change "Location"??


        })
       
    });



app.listen(3001, () => console.log('Example app is listening on port 3001.'));