require("dotenv").config()
const TaskHandler = require('./TaskHandler');
const DateHandler = require('../tule-app/src/DateHandler');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//Mongodb doc https://www.mongodb.com/docs/drivers/node/current/
//Fundamentals section will be your friend

class DbHandler {
    //Calling the mongodb connection string from .env so it isn't exposed on github
    #uri
    //Setting some standard suggested options
    #mongoOptions
    //create mongodb client with options from above
    #client;
    #db;
    #usersCollection;
    #tasksCollection;
    #taskHandler;
    #dateHandler;

    constructor(){     
        this.#uri = process.env.MONGO_CONNECTION;
        this.#mongoOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverApi: ServerApiVersion.v1
        }
        this.#client = new MongoClient(this.#uri, this.#mongoOptions);
        //establish connection with database
        this.#client.connect();
        //select database
        this.#db = this.#client.db('Tule');
        //create connection to each collection for use in routes
        this.#usersCollection = this.#db.collection('Users')
        this.#tasksCollection = this.#db.collection('Tasks') 
        this.#taskHandler = new TaskHandler();
        this.#dateHandler = new DateHandler();
    }

    loginVerify(req){
        return new Promise((resolve, reject) => {
            try{
                this.#usersCollection.find({Username: req.body.Username}).toArray().then(info => {
                    if(info.length == 1){
                        if(info[0]['Password'] === req.body.Password){            
                           resolve({"LoginSuccess":"True"});
                        }
                        else{
                            resolve({"LoginSuccess":"False",
                                "Error":"Incorrect Password"});
                        }
                    }
                    else if(info.length > 1){
                        resolve({"LoginSuccess":"False",
                            "Error":"Duplicate usernames exist"});
                    }
                    else{
                        resolve({"Error":"Username not found"});
                    }
                })
            }catch(err){
                reject(err);
            }
        })
    }

    accountCreate(req){
        return new Promise((resolve, reject) =>{
            try{
                this.#usersCollection.find({Username: req.body.Username}).toArray().then(info => {
                    console.log('test')
                    console.log(info);
                    var frontRes = {};
                    if(info.length == 0){
                        this.#usersCollection.insertOne(req.body);
                        console.log(req.body);
                        frontRes["AccountCreate"] = "True";
                        resolve(frontRes)
                    }
                    else {
                        frontRes["AccountCreate"] = "False";
                        resolve(frontRes)
                    }
                })
            }catch(err){
                reject(err);
            }
        })
    }

    getUserTasksVerbose(req){
        return new Promise((resolve, reject) => {
            try{
                this.#usersCollection.find({ Username: req.body.Username}).toArray().then(info => {
                    const tempInfo = info;
                    // populate a list with all IDs from info.activeTasks, info.inactiveTasks, info.recurringTasks, info.schedules
                    var tasksList = {};
                    this.#tasksCollection.find({"_id": {$in: tempInfo[0].ActiveTasks} }).toArray().then(info => {
                        tasksList["ActiveTasks"] = info;
                        this.#tasksCollection.find({"_id": {$in: tempInfo[0].InactiveTasks} }).toArray().then(info=> {
                            tasksList["InactiveTasks"] = info;
                            this.#tasksCollection.find({"_id": {$in: tempInfo[0].RecurringTasks} }).toArray().then(info=> {
                                tasksList["RecurringTasks"] = info; 
                                tasksList["Schedules"] = tempInfo[0].Schedules;
                                resolve(tasksList);  
                            })           
                        })
                    })
                }) 
            }catch(err){
                reject(err);
            }
        })    
    }


    getUserTasks(req){
        return new Promise((resolve, reject) => {
            try{
                this.#usersCollection.find({ Username: req.body.Username }).toArray().then(info => {
                    resolve(info);
                });
            }catch(err){
                reject(err);
            }
        })
    }

    saveTask(req){
        return new Promise((resolve, reject) => {
            var task = req.body.Task;
            console.log('savetask ', task);
            if (task._id != ""){
                var tempId = new ObjectId(task._id)
                try{
                    this.#tasksCollection.replaceOne({"_id":tempId},task).then(info => {
                        this.#usersCollection.find({"Username":req.body.Username}).toArray().then(user =>{
                            newUser = this.#taskHandler.updateTaskOnUser(user[0],task);
                            this.#usersCollection.replaceOne({"_id":user[0]["_id"]},newUser);
                            //check for completion of replace???
                        })
                    })
                    resolve(task);
                }catch(err){
                    reject(err);
                }
            }
            else {
                try{
                delete task["_id"];
                    this.#tasksCollection.insertOne(task).then(info => {
                        task["_id"] = info.insertedId;
                        this.#usersCollection.find({"Username":req.body.Username}).toArray().then(user =>{
                            console.log(user);
                            console.log('task in savetask ', task)
                            user = this.#taskHandler.addNewTaskToInactive(user[0],task);
                            console.log(user);
                            this.#usersCollection.replaceOne({"_id":user["_id"]},user);
                        })
                        resolve(task);
                    })
                }catch(err){
                    reject(err);
                }
                
            }
        })
    }

    pauseTask(req){
        return new Promise((resolve,reject) => {
            try{
                this.#usersCollection.find({ Username: req.body.Username }).toArray().then(user => {


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


                    this.#tasksCollection.updateOne({ "_id": pausedTask._id } , // change Active value of task under "StartTime" to false
                    {
                        "$set": {
                            "StartTime.Active" : false
                        }
                    }
                    )


                    // Change "Location"??
                    resolve('return info here');
                })
            }catch(err){
                reject(err)
            }
        })
    }

    //Takes a new schedule and makes sure that the user entry is up to date
    /*  {
            <scheduleId>(mmddyyy) :{
                "Tasks":[{"Id":<int64>, "StartTime":<String>(XX:XX)},...],
                "SchedStart":<string>(XX:XX),
                "SchedStop":<String>(XX:XX)
            }
        }
    */
    //Recurring tasks need different behavior
    altTask(req){
        return new Promise((resolve, reject) => {
            try{
                this.#usersCollection.find({Username : req.body.Username}).toArray().then(info => {
                    let user = this.#taskHandler.newSchedUserClean(info[0], req.body.Schedule);                    
                    this.#usersCollection.replaceOne({"_id":info[0]['_id']},user)
                    resolve(user);
                })
            }catch(err){
                reject(err);
            }
        })
    }

    deleteTask(req){
        return new Promise((resolve, reject) => {
            try{
                this.#usersCollection.find({ Username: req.body.Username }).toArray().then(user => {


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
            
                    this.#tasksCollection.deleteOne({"_id":tasktobeDeleted._id});
                    resolve(user);
                })
            }catch(err){
                reject(err)
            }
        })
    }

    createSchedule(req){
        return new Promise((resolve, reject) => {
            try{
                console.log(req.body);
                let tempDate = new Date(req.body.Date);
                let key = this.#dateHandler.dateToSchedKey(tempDate);
                this.getUserTasksVerbose(req).then(user => {
                    if(Object.keys(user['Schedules']).includes(key)){
                        user = this.#taskHandler.deleteSchedAndClean(user,key);
                    }
                    let newSched = this.#taskHandler.generateSchedule(user,tempDate, req.body.SchedStart, req.body.SchedEnd);
                    console.log('newSched', newSched['04182023']);
                    let newUser = this.#taskHandler.newSchedUserClean(user, tempDate, newSched);
                    this.getUserTasks(req).then(data => {
                        newUser = this.#taskHandler.addTasksAndSchedToUser(data[0],newUser);
                        console.log('createSched user', data);
                        console.log(newUser);
                        console.log(newUser)
                        /*this.#usersCollection.replaceOne({"_id":newUser["_id"]}, newUser).then(info => {
                            resolve(newUser);
                        })*/
                        resolve(newUser);
                    })                  
                })
            }catch(err){
                reject(err)
            }            
        })
    }

    getTaskById(idObject){
        this.#tasksCollection.find({'_id': idObject}).then(data => {
            console.log('getTaskById', data);
        })  
    }
}

module.exports = DbHandler;