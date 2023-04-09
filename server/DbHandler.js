require("dotenv").config()
const TaskHandler = require('./TaskHandler');
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
            if (task.Id != ""){
                var tempId = new ObjectId(task.Id)
                try{
                    tasksCollection.replaceOne({"_id":tempId},task).then(info => {
                        usersCollection.find({"Username":req.body.Username}).toArray().then(user =>{
                            newUser = this.#taskHandler.updateTaskOnUser(user[0],task);
                            usersCollection.replaceOne({"_id":user[0]["_id"]},newUser);
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
                delete task["Id"];
                    this.#tasksCollection.insertOne(task).then(info => {
                        task["Id"] = String(info.insertedId);
                        this.#usersCollection.find({"Username":req.body.Username}).toArray().then(user =>{
                            user = this.#taskHandler.addNewTaskToInactive(user[0],task);
                            this.#usersCollection.replaceOne({"_id":user[0]["_id"]},user);
                        })
                        resolve(task);
                    })
                }catch(err){
                    reject(err);
                }
                
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
                this.#usersCollection.find({Username : req.body.Username}).toArray().then(info => {
                    console.log('INFO: ', info);
                    var oldSched = info[0]['Schedules'][schedId]['Tasks'];
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
                    resolve(info[0]);
                })
            }catch(err){
                reject(err);
            }
        })
    }
}

module.exports = DbHandler;