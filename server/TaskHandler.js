const DateHandler = require('../DateHandler');

class TaskHandler{

    #dateHandler
    constructor(){
        this.#dateHandler = new DateHandler();
    }
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

    deleteSchedAndClean(userV,key){
         //convert all from active to inactive, or delete if recurring
        console.log('first user', userV);
        //load schedule to be deleted
        let delSched = userV['Schedules'][key];
        let delArr = [];
        console.log('schedule to delete',delSched);
        //iterate over the tasks in the schedule to find matches in active tasks
        for(let i = 0; i < delSched.length; i++){
            for(let j = 0; j < userV['ActiveTasks'].length; j++){
                if(String(delSched[i]['_id']) == String(userV['ActiveTasks'][j]['_id'])){
                    console.log('found task in active tasks.');
                    //add task to InactiveTasks and push index to array
                    userV['InactiveTasks'].push(userV['ActiveTasks'][j]);
                    delArr.push(j);
                    break;
                }
            }
        }
        //iterate over array backwards and remove tasks from ActiveTasks
        for(let i = delArr.length; i >= 0; i--){
            userV['ActiveTasks'].splice(delArr[i],1);
        }
        //delete sched from user
        delete userV['Schedules'][key];
        return userV;
    }

    //
    generateSchedule = (userV, date, schedStart,schedEnd) => {
        // Creates an array to store and organize tasks in.
        let dailySchedule = [];

        // Creates arrays to store tasks with a start time.
        let concrete = [];

        // Creates arrays to store tasks with no start time based on priority.
        let priority3 = [];
        let priority2 = [];
        let priority1 = [];
        let priority0 = [];
        let inactiveTasks = userV['InactiveTasks'];
        console.log(inactiveTasks);

        // Orgainizes tasks based on whether they have a start time.
        // If the task has no start time, this organizes the task
        // based on its priority.
        for (let t = 0; t < inactiveTasks.length; t++) {
            if (inactiveTasks[t].StartTime.Active && 
                this.#dateHandler.dateToSchedKey(inactiveTasks[t]['Date']['Active']) == true &&
                this.#dateHandler.dateToSchedKey(date) == 
                this.#dateHandler.dateToSchedKey(inactiveTasks[t]['Date']['Time'])){
                concrete.push(inactiveTasks[t]);
            } else {
                switch (inactiveTasks[t].Priority) {
                    case 3:
                        priority3.push(inactiveTasks[t]);
                        break;
                    case 2:
                        priority2.push(inactiveTasks[t]);
                        break;
                    case 1:
                        priority1.push(inactiveTasks[t]);
                        break;
                    case 0:
                        priority0.push(inactiveTasks[t]);
                        break;
                }
            }
        }

        // This organizes both the priority arrays and
        // the array that stores tasks with a start time
        // by sorting by longest duration time.
        if(concrete.length > 1){
            concrete = concrete.sort(this.compareDuration); 
        }
        if(priority3.length > 1){
            priority3 = priority3.sort(this.compareDuration);
        }
        if(priority2.length > 1){
            priority2 = priority2.sort(this.compareDuration);
        }
        if(priority1.length > 1){
            priority1 = priority1.sort(this.compareDuration);
        }
        if(priority0.length > 1){
            priority0 = priority0.sort(this.compareDuration);
        }

        console.log('concrete', concrete);
        console.log('priority3', priority3);
        console.log('priority2', priority2);
        console.log('priority1', priority1);
        console.log('priority0', priority0);
        
        // Allocates time for tasks with a start time,
        // then allocates time for tasks with decreasing priority.
        dailySchedule = this.dailyAlgorithm(dailySchedule, concrete, schedStart, schedEnd, true);
        dailySchedule = this.dailyAlgorithm(dailySchedule, priority3, schedStart, schedEnd);
        dailySchedule = this.dailyAlgorithm(dailySchedule, priority2, schedStart, schedEnd);
        dailySchedule = this.dailyAlgorithm(dailySchedule, priority1, schedStart, schedEnd);
        dailySchedule = this.dailyAlgorithm(dailySchedule, priority0, schedStart, schedEnd);
        console.log('dailySchedule', dailySchedule);
        return dailySchedule;
    }

    // Makes an a schedule for the day. It does this by first
    // scheduling the tasks with a start time, then scheduling tasks
    // one by one, first by priority, then by duration. The tasks with
    // the longest duration get scheduled first.        
    dailyAlgorithm(dailySchedule, taskList, schedStart = "08:00",
        schedEnd = "24:00",first = false) {
        // Checks if this is the first time the algorithm is adding to
        // the dailySchedule array. If it is, it will add the first task
        // to the array, then run the rest of the algorithm.
        // Scheduled tasks need to have a duration.
        if (first) {
            for (let i = 0; i < taskList.length; i++) {
                // First we set the start and duration time of the task.
                // The end time is the duration plus the break time
                // if it has one.
                const taskStart = taskList[i].StartTime.Time;
                if (taskList[i].BreakDuration.Active) {
                    var totalDuration = addTime(
                        taskList[i].Duration.Time,
                        taskList[i].BreakDuration.Time);
                } else {
                    var totalDuration = taskList[i].Duration.Time;
                }
                // Then we add the task to the dailySchedule array.
                // The end time is the task start time plus the duration.
                dailySchedule.push(
                    [taskStart, taskList[i].Name,
                    addTime(totalDuration, taskStart)]);
            }
        // If the algorithm is not adding the tasts with a start time,
        // it will come here and finds a place to schedule each task.
        } else {
            for (let i = 0; i < taskList.length; i++) {
                // First we set the duration time of the task.
                // The end time is the duration plus the break time.
                if (taskList[i].BreakDuration.Active) {
                    var taskDuration = addTime(
                        taskList[i].Duration.Time,
                        taskList[i].BreakDuration.Time)
                } else {
                    var taskDuration = taskList[i].Duration.Time
                }
                // Searches through the dailySchedule array to find a place
                // to schedule the current task.
                var success = false;
                var x = 0;
                while (!success && (x < dailySchedule.length)) {
                    // This checks to see if there is a next task
                    // in the schedule.
                    if (dailySchedule[x + 1] == undefined) {
                        if (compareDuration(
                                subtractTime(schedEnd, dailySchedule[x][2]),
                                taskDuration) === 1) {
                            const taskStart = dailySchedule[x][2];
                            dailySchedule.push(
                                [taskStart, taskList[i].Name,
                                addTime(taskStart, taskDuration)]);
                            success = true;
                        }
                    } else {
                        // First tries to fill the gap between the first task
                        // and the start of the day.
                        if (compareDuration(
                                subtractTime(
                                    dailySchedule[x + 1][0],
                                    schedStart),
                                taskDuration) === 1) {
                            const taskStart = dailySchedule[x][2];
                            dailySchedule.splice(x, 0,
                                [taskStart, taskList[i].Name,
                                addTime(taskStart, taskDuration)]);
                            success = true;
                        // If the gap between the first task and
                        // the start of the day isnt big enough, we look
                        // for a gap between the tasks.
                        } else if (compareDuration(
                                subtractTime(
                                    dailySchedule[x + 1][0],
                                    dailySchedule[x][2]),
                                taskDuration) === 1) {
                            const taskStart = dailySchedule[x][2];
                            dailySchedule.splice(x, 0,
                                [taskStart, taskList[i].Name,
                                addTime(taskStart, taskDuration)]);
                            success = true;
                        }
                    }
                    x++;
                }
            }
        }
        return dailySchedule;
    }
    // Subraction of time. This is needed to determine the duration of tasks.
    subtractTime(timeStr1, timeStr2) {
        const hours = (parseInt(timeStr1[0] + timeStr1[1])
            - parseInt(timeStr2[0] + timeStr2[1]));
        const minutes = (parseInt(timeStr1[3] + timeStr1[4])
            - parseInt(timeStr2[3] + timeStr2[4]));
        if (minutes < 0) {
            minutes += 60;
            hours -= 1;
        }
        if (hours < 0) {
            hours += 24;
        }
        if (hours < 10) {
            hours = "0" + hours.toString();
        } else{
            hours = hours.toString();
        }
        if (minutes < 10) {
            minutes = "0" + minutes.toString();
        } else {
            minutes = minutes.toString();
        }
        return (hours + ":" + minutes);
    }

    // Compare two times. This is needed to determine if a task
    // can be scheduled.
    // Returns 1 if timeStr1 is greater than timeStr2,
    // -1 if timeStr1 is less than timeStr2, and
    // 0 if timeStr1 is equal to timeStr2.
    compareDuration(a, b) {
        if (parseFloat(a.Duration) < parseFloat(b.Duration)) {
            return 1;
        } else if (parseFloat(a.Duration) > parseFloat(b.Duration)) {
            return -1;
        } else {
            return 0;
        }
    }

    // Adds time to a time string. This is needed to add breaks to tasks.
    addTime(timeStr1, timeStr2) {
        const hours = (parseInt(timeStr1[0] + timeStr1[1])
            + parseInt(timeStr2[0] + timeStr2[1]));
        const minutes = (parseInt(timeStr1[3] + timeStr1[4])
            + parseInt(timeStr2[3] + timeStr2[4]));
        if (minutes > 59) {
            minutes -= 60;
            hours += 1;
        }
        if (hours > 23) {
            hours -= 24;
        }
        if (hours < 10) {
            hours = "0" + hours.toString();
        } else{
            hours = hours.toString();
        }
        if (minutes < 10) {
            minutes = "0" + minutes.toString();
        } else {
            minutes = minutes.toString();
        }
        return (hours + ":" + minutes);
    }
}


module.exports = TaskHandler