const DbHandler = require('./DbHandler');

class TaskHandler{

    //Given a user object from the database, and a task object, will return 
    //a new user object with the appropriate tasks
    updateTaskOnUser(user,task){
        try{
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
            for(var i = 0; i < user['ActiveTasks'].length; i++){
                if(String(user['ActiveTasks'][i]) == String(tempId)){
                    user['ActiveTasks'].splice(i,1);
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
            return err;
        }catch(err){
            return(err);
        }
    }

    addNewTaskToInactive(user, task){
        user["InactiveTasks"].push(task["_id"]);
        return user;
    }

    newSchedUserClean(user, newSched){
        var schedId = Object.keys(newSched);
        schedId = schedId[0];
        var taskList = req.body.Schedule[schedId]['Tasks'];
        var newIdList = []
        for(var i = 0; i < taskList.length; i++){
            newIdList.push(taskList[i]['Id'])
        }
        var oldSched = user['Schedules'][schedId]['Tasks'];
        var oldIdList = [];
        for(var i = 0; i < oldSched.length; i++){
            oldIdList.push(oldSched[i]['Id'].toString());
        }
        //Swap inactive to active
        for(var i = 0; i < newIdList.length; i++){
            if(!oldIdList.includes(newIdList[i])){
                console.log('Found id in newlist not in oldlist');
                let object = new ObjectId(newIdList[i]);
                user['ActiveTasks'].push(object);
                let inactive = user['InactiveTasks'];
                var index = 0;
                while(inactive[index].toString() != newIdList[i]){
                    index++
                }
                user['InactiveTasks'].splice(index,1);
            }
        }
        //Swap active to inactive
        for(var i = 0; i < oldIdList.length; i++){
            if(!newIdList.includes(oldIdList[i])){
                console.log('Found id in oldList not in newlist');
                let object = new ObjectId(oldIdList[i]);
                user["InactiveTasks"].push(object);
                let active = user['ActiveTasks'];
                var index = 0;
                while(active[index].toString() != oldIdList[i]){
                    index++
                }
                user['ActiveTasks'].splice(index,1);
            }
        }
        //Update schedule to new schedule
        user['Schedules'][schedId] = newSched[schedId];
        return user;
    }

    populateSched(verboseUser){
        let schedKeys = Object.keys(verboseUser['Schedules']);
        let schedules = verboseUser['Schedules'];
        let activeTasks = verboseUser['ActiveTasks'];
        for(let i = 0; i < schedKeys.length; i++){
            let currentSched = schedules[schedKeys[i]];
            for(let j = 0; j < currentSched.length; j++){
                for(let k = 0; k < activeTasks.length; k++){
                    if(String(activeTasks[k]['_id']) == String(currentSched[j]['_id'])){
                        let tempTask = activeTasks[k];
                        tempTask['StartTime'] = currentSched[j]['SchedStartTime']
                        currentSched[j] = tempTask;
                        break;
                    }
                }
            }
            verboseUser['Schedules'][schedKeys[i]] = currentSched;
        }
        return verboseUser;
        
    }

    deleteSchedAndClean(user,key){
         //convert all from active to inactive, or delete if recurring
        console.log('first user', user);
        //load schedule to be deleted
        let delSched = user['Schedules'][key];
        let delArr = [];
        console.log('schedule to delete',delSched);
        //iterate over the tasks in the schedule to find matches in active tasks
        for(let i = 0; i < delSched.length; i++){
            for(let j = 0; j < user['ActiveTasks'].length; j++){
                if(String(delSched[i]['_id']) == String(user['ActiveTasks'][j]['_id'])){
                    console.log('found task in active tasks.');
                    //add task to InactiveTasks and push index to array
                    user['InactiveTasks'].push(user['ActiveTasks'][j]);
                    delArr.push(j);
                    break;
                }
            }
        }
        //iterate over array backwards and remove tasks from ActiveTasks
        for(let i = delArr.length; i >= 0; i--){
            user['ActiveTasks'].splice(delArr[i],1);
        }
        //delete sched from user
        delete user['Schedules'][key];
        console.log(user);
    }
}

module.exports = TaskHandler