require("dotenv").config()
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
                    //console.log('passed find operation', info);
                    //console.log('active tasks', info[0].ActiveTasks);
                    //console.log('inactive tasks', info[0].InactiveTasks);
                    //console.log('recurring', info[0].RecurringTasks);
                    //console.log('schedules: ', info[0].Schedules);
                    // populate a list with all IDs from info.activeTasks, info.inactiveTasks, info.recurringTasks, info.schedules
                    var tasksList = {};
                    this.#tasksCollection.find({"_id": {$in: tempInfo[0].ActiveTasks} }).toArray().then(info => {
                        //console.log('tasksCollection return active', info);
                        tasksList["ActiveTasks"] = info;
                        this.#tasksCollection.find({"_id": {$in: tempInfo[0].InactiveTasks} }).toArray().then(info=> {
                            //console.log('tasksCollection return inactive', info);
                            tasksList["InactiveTasks"] = info;
                            this.#tasksCollection.find({"_id": {$in: tempInfo[0].RecurringTasks} }).toArray().then(info=> {
                                //console.log('tasksCollection return recurring', info);
                                tasksList["RecurringTasks"] = info; 
                                tasksList["Schedules"] = tempInfo[0].Schedules;
                                //console.log('Final List:', tasksList)
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
                            let recKeyList = Object.keys(task['Recurrence']);
                            let recFlag = false;
                            for (var i = 0; i < user[0]['RecurringTasks'].length; i++){
                                if (String(user[0]['RecurringTasks'][i]) == String(tempId)){
                                    user[0]['RecurringTasks'].splice(i,1);
                                    break;
                                }
                            }
                            for(var i = 0; i  < user[0]['InactiveTasks'].length; i++){
                                if (String(user[0]['InactiveTasks'][i]) == String(tempId)){
                                    user[0]['InactiveTasks'].splice(i,1);
                                    break;
                                }
                            }
                            for (var i = 0; i < recKeyList.length; i++){
                                if (task['Recurrence'][recKeyList[i]]){
                                    user[0]['RecurringTasks'].push(tempId);
                                    recFlag = true;
                                    break;
                                }
                            }
                            if (recFlag == false){
                                user[0]['InactiveTasks'].push(tempId);

                            }
                            usersCollection.replaceOne({"_id":user[0]["_id"]},user);
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
                        //console.log('debug info', info)
                        //console.log('debug', task["_id"]);
                        this.#usersCollection.find({"Username":req.body.Username}).toArray().then(user =>{
                            //console.log('debug user', user);
                            user[0]['InactiveTasks'].push(task["_id"]);
                            //console.log('user debug 2', user);
                            this.#usersCollection.replaceOne({"_id":user[0]["_id"]},user[0]);
                        })
                        resolve(task);
                    })
                }catch(err){
                    reject(err);
                }
                
            }
        })
    }
}

module.exports = DbHandler;