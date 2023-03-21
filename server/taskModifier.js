const ObjectId = require('mongodb')

class TaskMod {
    constructor(){}

    toDb(task){
        if (task['Id'].typeof == String){
            task['Id'] = new ObjectId(task['id']);
        }
        return task;
    }
    toFront(task){
        if (task['Id'].typeof == ObjectId){
            task['Id'] = task['Id'].toString();
        }
    }

    InactiveToActive(id, dbInfo){
        var tempId = id;
        if (id.typeof != String){
            tempId = tempId.toString();
        }
        dbInfo[0]['ActiveTasks'].push(new ObjectId(tempId));
        let inactive = dbInfo[0]['InactiveTasks'];
        var index = 0;
        while(inactive[index].toString() != tempId){
            index++
        }
        dbInfo[0]['InactiveTasks'].splice(index,1);
        return dbInfo;
    }

    ActiveToInactive(id, dbInfo){
        var tempId = id;
        if(id.typeof != String){
            tempId = tempId.toString();
        }
        dbInfo[0]['InactiveTasks'].push(new ObjectId(tempId));
        let active = dbInfo[0]['ActiveTasks'];
        var index = 0;
        while(active[index].toString() != tempId){
            index++
        }
        dbInfo[0]['ActiveTasks'].splice(index,1);
        return dbInfo;
    }
}

export{taskMutator}