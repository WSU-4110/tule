const DateHandler = require('../tule-app/src/DateHandler');
const {ObjectId } = require('mongodb');

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

    newSchedUserClean(user, date, newSched){
        var schedId = Object.keys(newSched);
        schedId = schedId[0];
        var taskList = newSched[schedId]['Tasks'];
        var newIdList = [];
        var delArr = [];
        var index = 0;
        for(var i = 0; i < taskList.length; i++){
            newIdList.push(taskList[i]["_id"]);
        }
        console.log('newSchedUser',user);
        console.log('newIdList', newIdList);
        console.log('taskList', taskList)
        //Swap inactive to active
        for(let i = 0; i < newIdList.length; i++){
            user['ActiveTasks'].push(newIdList[i]);
            let inactive = user['InactiveTasks'];
            index = 0;
            while(String(inactive[index]['_id']) != String(newIdList[i])){
                delArr.push(index);
                index++
            }
        }
        //iterate backwards over delArr to remove tasks from inactive
        //Update schedule to new schedule
        delArr = delArr.sort(this.compareNum);
        console.log('delArr',delArr);
        for(let i = 0; i < delArr.length; i++){
            user['InactiveTasks'].splice(delArr[i],1);
        }
        user['Schedules'][schedId] = newSched[schedId];
        console.log('newSchedUserClean',user);
        for (let i = 0; i < user['ActiveTasks'].length; i++){
            console.log('resetting active tasks')
            if(Object.keys(user['ActiveTasks'][i]).length > 1){
                console.log('deeper reset');
                user['ActiveTasks'][i] = user['ActiveTasks'][i]['_id'];
            }
        }
        for (let i = 0; i < user['InactiveTasks'].length; i++){
            if(Object.keys(user['ActiveTasks'][i]).length > 1){
                user['InactiveTasks'][i] = user['InactiveTasks'][i]['_id'];
            }
        }
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
        //console.log('first user', userV);
        //load schedule to be deleted
        console.log('key in delete', key);
        let delSched = userV['Schedules'][key];
        console.log(delSched['Tasks'].length);
        let delArr = [];
        //console.log('schedule to delete',delSched);
        //iterate over the tasks in the schedule to find matches in active tasks
        for(let i = 0; i < delSched['Tasks'].length; i++){
            for(let j = 0; j < userV['ActiveTasks'].length; j++){
                if(String(delSched['Tasks'][i]['_id']) == String(userV['ActiveTasks'][j]['_id'])){
                    console.log('found task in active tasks.');
                    //add task to InactiveTasks and push index to array
                    userV['InactiveTasks'].push(userV['ActiveTasks'][j]['_id']);
                    delArr.push(j);
                    break;
                }
            }
        }
        delArr = delArr.sort(this.compareNum);
        for(let i = 0; i < delArr.length; i++){
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
        // Orgainizes tasks based on whether they have a start time.
        // If the task has no start time, this organizes the task
        // based on its priority.
        console.log(date);
        console.log('in schedgen', userV['InactiveTasks']);
        for (let t = 0; t < inactiveTasks.length; t++) {
            if (inactiveTasks[t].StartTime.Active && 
                inactiveTasks[t]['Date']['Active'] == true &&
                this.#dateHandler.dateToSchedKey(date) == 
                this.#dateHandler.dateToSchedKey(new Date(inactiveTasks[t]['Date']['Time']))){
                concrete.push(inactiveTasks[t]);
            } else {
                switch (inactiveTasks[t].Priority) {
                    case 3:
                        if(inactiveTasks[t]['Date']['Active'] == false ||
                        this.#dateHandler.dateToSchedKey(date) == 
                        this.#dateHandler.dateToSchedKey(new Date(inactiveTasks[t]['Date']['Time']))){
                            priority3.push(inactiveTasks[t]);
                        }
                        break;
                    case 2:
                        if(inactiveTasks[t]['Date']['Active'] == false || 
                        this.#dateHandler.dateToSchedKey(date) == 
                        this.#dateHandler.dateToSchedKey(new Date(inactiveTasks[t]['Date']['Time']))){
                            priority2.push(inactiveTasks[t]);
                        }
                        break;
                    case 1:
                        if(inactiveTasks[t]['Date']['Active'] == false || 
                        this.#dateHandler.dateToSchedKey(date) == 
                        this.#dateHandler.dateToSchedKey(new Date(inactiveTasks[t]['Date']['Time']))){
                            priority1.push(inactiveTasks[t]);
                        }
                        break;
                    case 0:
                        if(inactiveTasks[t]['Date']['Active'] == false ||
                        this.#dateHandler.dateToSchedKey(date) == 
                        this.#dateHandler.dateToSchedKey(new Date(inactiveTasks[t]['Date']['Time']))){
                            priority0.push(inactiveTasks[t]);
                        }
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
        dailySchedule = this.dailyAlgorithm(dailySchedule, concrete, schedStart, schedEnd);
        console.log('daily after concrete', dailySchedule);
        dailySchedule = this.dailyAlgorithm(dailySchedule, priority3, schedStart, schedEnd);
        dailySchedule = this.dailyAlgorithm(dailySchedule, priority2, schedStart, schedEnd);
        console.log('daily after priority2', dailySchedule);
        dailySchedule = this.dailyAlgorithm(dailySchedule, priority1, schedStart, schedEnd);
        dailySchedule = this.dailyAlgorithm(dailySchedule, priority0, schedStart, schedEnd);
        //dailySchedule to returnSchedule function here.
        let returnSched = {}
        let tempDate = this.#dateHandler.dateToSchedKey(date);
        returnSched[tempDate] = {};
        returnSched[tempDate]["SchedStart"] = schedStart;
        returnSched[tempDate]["SchedStop"] = schedEnd;
        returnSched[tempDate]['Tasks'] = [];
        for(let i = 0; i < dailySchedule.length; i++){
            let tempTask = {
                "_id": dailySchedule[i]["_id"],
                "SchedStartTime" : dailySchedule[i]['SchedStartTime']
            };
            returnSched[tempDate]['Tasks'].push(tempTask);
        }
        console.log('returnSched', returnSched);
        return returnSched;
    }

    // Makes an a schedule for the day. It does this by first
    // scheduling the tasks with a start time, then scheduling tasks
    // one by one, first by priority, then by duration. The tasks with
    // the longest duration get scheduled first.        
    dailyAlgorithm(dailySchedule, taskList, schedStart = "08:00",
        schedEnd = "24:00") {        
        // If the algorithm is not adding the tasts with a start time,                 
        // it will come here and finds a place to schedule each task.
        for (let i = 0; i < taskList.length; i++) {
            // First we set the duration time of the task.
            // The end time is the duration plus the break time.
            if (taskList[i].Break.Active) {
                var taskDuration = this.addTime(
                    taskList[i].Duration,
                    taskList[i].Break.Time);
            } else {
                var taskDuration = taskList[i].Duration;
            }
            
            var tempTask = taskList[i];
            if(dailySchedule.length == 0){
                if(taskList[i]["StartTime"]['Active']){
                    tempTask["SchedStartTime"] = taskList[i]["StartTime"]["Time"];
                }
                else{
                    tempTask['SchedStartTime'] = schedStart;
                }
                dailySchedule.push(tempTask);
            }
            else{
                if(taskList[i]["StartTime"]['Active']){
                    taskList[i]['SchedStartTime'] = taskList[i]['StartTime']['Time'];
                    // different behavior (unsure how to handle conflicts)
                    //iterate over to put the task in appropriate spot
                    console.log(dailySchedule.length);
                    for(let j = 0; j < dailySchedule.length; j++){
                        console.log('j',j);
                        if(j == 0){
                            console.log('tempTask in j == 0', tempTask);
                            //start of the schedule
                            let schedArr = schedStart.split(':');
                            let schedStartFloat = parseFloat(schedArr[0]) + parseFloat(schedArr[1])/60;
                            //current task in dailySchedule
                            schedArr = dailySchedule[j]['SchedStartTime'];
                            schedArr = schedArr.split(':');
                            let nextTaskStartFloat = parseFloat(schedArr[0]) + parseFloat(schedArr[1])/60;
                            //                            
                            schedArr = taskList[i]['StartTime']['Time'];
                            schedArr = schedArr.split(':');
                            let taskStartFloat =  parseFloat(schedArr[0]) + parseFloat(schedArr[1])/60;
                            let taskEndFloat = taskStartFloat + taskList[i]['Duration'];
                            console.log('9 8 10 16');
                            console.log(taskStartFloat, schedStartFloat, taskEndFloat, nextTaskStartFloat);
                            if(taskStartFloat >= schedStartFloat && taskEndFloat <= nextTaskStartFloat){
                                tempTask['SchedStartTime'] = taskList[i]['StartTime']['Time'];
                                dailySchedule.splice(j,0,tempTask);
                                break;
                            }
                        }
                        if(j > 0){
                            console.log('tempTask in j > 0', tempTask);
                            //check task against previous task end and current task start
                            //if fits then insert and break
                            //end of previous and start of next task
                            let schedArr = dailySchedule[j-1]['SchedStartTime'].split(':');
                            let prevTaskFloat = parseFloat(schedArr[0]) + parseFloat(schedArr[1])/60;
                            prevTaskFloat += dailySchedule[j-1]['Duration'];
                            schedArr = dailySchedule[j]['SchedStartTime'].split(':');
                            let currentTaskFloat = parseFloat(schedArr[0]) + parseFloat(schedArr[1])/60;
                            // start and end for task to be inserted
                            schedArr = taskList[i]['StartTime']['Time'];
                            schedArr = schedArr.split(':');
                            let taskStartFloat =  parseFloat(schedArr[0]) + parseFloat(schedArr[1])/60;
                            let taskEndFloat = taskStartFloat + taskList[i]['Duration'];
                            if(taskStartFloat >= prevTaskFloat && taskEndFloat <= currentTaskFloat){
                                tempTask['SchedStartTime'] = taskList[i]['StartTime']['Time'];
                                if(j == dailySchedule.length-1){
                                    dailySchedule.push(tempTask);
                                }
                                else{
                                    dailySchedule.splice(j,0,tempTask);
                                }
                                break;
                            }
                        }
                        if(j == dailySchedule.length - 1){
                            console.log('tempTask in end of array', tempTask)
                            //check between current task and schedule end for enough time to insert
                            //insert, break
                            let schedArr = dailySchedule[j]['SchedStartTime'].split(':');
                            let currentTaskFloat = parseFloat(schedArr[0]) + parseFloat(schedArr[1])/60;
                            currentTaskFloat += dailySchedule[j]['Duration'];
                            schedArr = schedEnd.split(':');
                            let schedEndFloat = parseFloat(schedArr[0]) + parseFloat(schedArr[1])/60;
                            schedArr = taskList[i]['StartTime']['Time'];
                            schedArr = schedArr.split(':');
                            let taskStartFloat =  (parseFloat(schedArr[0]) + parseFloat(schedArr[1])/60) + taskList[i]['Duration'];
                            let taskEndFloat = taskStartFloat ;
                            if(taskStartFloat >= currentTaskFloat && taskEndFloat <= schedEndFloat){
                                tempTask['SchedStartTime'] = taskList[i]['StartTime']['Time'];
                                dailySchedule.push(tempTask);
                                break;
                            }
                        }
                    }                    
                }
                else{
                    // Searches through the dailySchedule array to find a place
                    // to schedule the current task.
                    var x = 0;
                    while (x < dailySchedule.length) {
                        if(x == 0){
                            //check the SchedStartTime for the first task, and see if there is a difference between schedStart and the task start time
                            //if the task fits insert at beginning and break
                            let schedArr = schedStart.split(':');
                            let schedStartFloat = parseFloat(schedArr[0]) + parseFloat(schedArr[1])/60;
                            schedArr = dailySchedule[x]['SchedStartTime'];
                            schedArr = schedArr.split(':');
                            let taskStartFloat = parseFloat(schedArr[0]) + parseFloat(schedArr[1])/60;
                            console.log('x==0 compare', schedStartFloat, taskStartFloat);
                            if(tempTask["Duration"] <= taskStartFloat - schedStartFloat){
                                console.log('in x==0 if');
                                tempTask['SchedStartTime'] = schedStart;
                                dailySchedule.splice(x,0,tempTask);
                                x++;
                                break;
                            }
                        }                        
                        if(x > 0){
                            //check task against previous task end and current task start
                            //if fits then insert and break
                            let schedArr = dailySchedule[x-1]['SchedStartTime'].split(':');
                            let prevTaskFloat = parseFloat(schedArr[0]) + parseFloat(schedArr[1])/60;
                            prevTaskFloat += dailySchedule[x-1]['Duration'];
                            schedArr = dailySchedule[x]['SchedStartTime'].split(':');
                            let currentTaskFloat = parseFloat(schedArr[0]) + parseFloat(schedArr[1])/60;
                            if(tempTask["Duration"] <= currentTaskFloat - prevTaskFloat){
                                let tempTime = parseInt(prevTaskFloat * 60);
                                let tempHours = String(Math.floor(prevTaskFloat));
                                let tempMinutes = String(tempTime % 60);
                                if(tempHours.length == 1){
                                    tempHours = '0' + tempHours;
                                }
                                if(tempMinutes.length == 1){
                                    tempMinutes = '0' + tempMinutes;
                                }                                
                                let tempStr = tempHours + ':' + tempMinutes;
                                tempTask['SchedStartTime'] = tempStr;
                                dailySchedule.splice(x,0,tempTask);
                                x++;
                                break;
                            }
                        }
                        if(x == dailySchedule.length - 1){
                            //check between current task and schedule end for enough time to insert
                            //insert, break
                            let schedArr = dailySchedule[x]['SchedStartTime'].split(':');
                            let currentTaskFloat = parseFloat(schedArr[0]) + parseFloat(schedArr[1])/60;
                            currentTaskFloat += dailySchedule[x]['Duration'];
                            schedArr = schedEnd.split(':');
                            let schedEndFloat = parseFloat(schedArr[0]) + parseFloat(schedArr[1])/60;
                            if(tempTask["Duration"] <= schedEndFloat - currentTaskFloat){
                                let tempTime = parseInt(currentTaskFloat * 60);
                                let tempHours = String(Math.floor(currentTaskFloat));
                                if(tempHours.length == 1){
                                    tempHours = '0' + tempHours;
                                }
                                let tempMinutes = String(tempTime % 60);
                                if(tempMinutes.length == 1){
                                    tempMinutes = '0' + tempMinutes;
                                }
                                let tempStr = tempHours + ':' + tempMinutes;
                                tempTask['SchedStartTime'] = tempStr;
                                dailySchedule.push(tempTask);
                                x++
                                break;
                            }
                        }
                        x++
                    }
                }
            }
        }        
        return dailySchedule;
    }
    // Subraction of time. This is needed to determine the duration of tasks.
    subtractTime(timeStr1, timeStr2) {
        var hours = (parseInt(timeStr1[0] + timeStr1[1])
            - parseInt(timeStr2[0] + timeStr2[1]));
        var minutes = (parseInt(timeStr1[3] + timeStr1[4])
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

    compareNum(a,b){
        if(parseInt(a) < parseInt(b)){
            return 1;
        } else if (parseInt(a) > parseInt(b)){
            return -1;
        } else {
            return 0;
        }
    }

    // Adds time to a time string. This is needed to add breaks to tasks.
    addTime(timeStr1, timeStr2) {
        var hours = (parseInt(timeStr1[0] + timeStr1[1])
            + parseInt(timeStr2[0] + timeStr2[1]));
        var minutes = (parseInt(timeStr1[3] + timeStr1[4])
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

    addTasksAndSchedToUser(user,tasks){
        user['ActiveTasks'] = tasks['ActiveTasks'];
        user['InactiveTasks'] = tasks['InactiveTasks'];
        user['Recurringtasks'] = tasks['RecurringTasks'];
        user['Schedules'] = tasks['Schedules'];
        return user;
    }
}


module.exports = TaskHandler