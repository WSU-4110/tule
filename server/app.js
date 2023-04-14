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

app.post('/GetAllTasksAndSched', async (req,res) => {
    
})
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
    res.send(await dbHandler.saveTask(req));
})

/*app.post('/CreateSchedule', async (req,res) =>{
    const tasks = dbHandler.getUserTasksVerbose(req);
    const newSchedule = taskHandler.generateSchedule(await tasks)
})*/


app.post('/DeleteTask', async (req, res) => { // search userCollection.find, iterate all tasks and look for ID, remove ID. do the same to taskCollection
   res.send(await dbHandler.deleteTask(req));
})

app.post('/CreateSchedule', async (req,res) =>{
    res.send(await dbHandler.createSchedule(req));
})

app.post('/PauseTask', async (req, res) => {
    res.send(await dbHandler.pauseTask(req));
});



app.listen(3001, () => console.log('Example app is listening on port 3001.'));