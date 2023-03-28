// This is the algorithm that will be used to schedule tasks for the day.
// 'inputTasks' is an array of tasks that will be scheduled.
function algorithm(inputTasks, schedStart = "08:00", schedEnd = "24:00") {

    // Creates an array to store and organize tasks in.
    var dailySchedule = new Array();

    // Creates arrays to store tasks with a start time.
    const concrete = new Array();

    // Creates arrays to store tasks with no start time based on priority.
    const priority3 = new Array();
    const priority2 = new Array();
    const priority1 = new Array();
    const priority0 = new Array();

    // Adds time to a time string. This is needed to add breaks to tasks.
    function addTime(timeStr1, timeStr2) {
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

    // Subraction of time. This is needed to determine the duration of tasks.
    function subtractTime(timeStr1, timeStr2) {
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
    function compareDuration(timeStr1, timeStr2) {
        const scheduleHours = parseInt(timeStr1[0] + timeStr1[1]);
        const durationHours = parseInt(timeStr2[0] + timeStr2[1]);
        const scheduleMinutes = parseInt(timeStr1[3] + timeStr1[4]);
        const durationMinutes = parseInt(timeStr2[3] + timeStr2[4]);
        if (scheduleHours > durationHours) {
            return 1;
        } else if (scheduleHours < durationHours) {
            return -1;
        } else {
            if (scheduleMinutes > durationMinutes) {
                return 1;
            } else if (scheduleMinutes < durationMinutes) {
                return -1;
            } else {
                return 0;
            }
        }
    }

    // Makes an a schedule for the day. It does this by first
    // scheduling the tasks with a start time, then scheduling tasks
    // one by one, first by priority, then by duration. The tasks with
    // the longest duration get scheduled first.
    function dailyAlgorithm(taskList, first = false, schedStart = "08:00",
        schedEnd = "24:00",) {
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
    }

    // Orgainizes tasks based on whether they have a start time.
    // If the task has no start time, this organizes the task
    // based on its priority.
    for (let t = 0; t > inputTasks.length; t++) {
        if (inputTasks[t].StartTime.Active) {
            concrete.push(inputTasks[t]);
        } else {
            switch (inputTasks[t].Priority) {
                case 3:
                    priority3.push(inputTasks[t]);
                    break;
                case 2:
                    priority2.push(inputTasks[t]);
                    break;
                case 1:
                    priority1.push(inputTasks[t]);
                    break;
                case 0:
                    priority0.push(inputTasks[t]);
                    break;
            }
        }
    }

    // This organizes both the priority arrays and
    // the array that stores tasks with a start time
    // by sorting by longest duration time.
    concrete = concrete.sort(
        function(a, b) { 
            return compareDuration(b.Duration.Time, a.Duration.Time) });
    priority3 = priority3.sort(
        function(a, b) { 
            return compareDuration(b.Duration.Time, a.Duration.Time) });
    priority2 = priority2.sort(
        function(a, b) { 
            return compareDuration(b.Duration.Time, a.Duration.Time) });
    priority1 = priority1.sort(
        function(a, b) { 
            return compareDuration(b.Duration.Time, a.Duration.Time) });
    priority0 = priority0.sort(
        function(a, b) { 
            return compareDuration(b.Duration.Time, a.Duration.Time) });

    // Allocates time for tasks with a start time,
    // then allocates time for tasks with decreasing priority.
    dailyAlgorithm(concrete, schedStart, schedEnd, first=true);
    dailyAlgorithm(priority3, schedStart, schedEnd);
    dailyAlgorithm(priority2, schedStart, schedEnd);
    dailyAlgorithm(priority1, schedStart, schedEnd);
    dailyAlgorithm(priority0, schedStart, schedEnd);

    return dailySchedule;
}


// This function randomly generates a list of tasks.
function generateTasks(count) {
    const taskList = [];
    for (let i = 0; i < count; i++) {
        const task = {
            Name: "Task " + i,
            StartTime: {
                Active: Math.random() >= 0.7,
                Time: randomTime(24, 8)
            },
            Priority: Math.floor(Math.random() * 4),
            Duration: {
                Time: randomTime(4)
            },
            BreakDuration: {
                Active: Math.random() >= 0.5,
                Time: randomTime(2)
            }
        }
        taskList.push(task);
    }
    return taskList;
}

// This function generates a random time.
function randomTime(max, min) {
    if (min === undefined) {
        var hour = Math.floor(Math.random() * max);
    } else {
        var hour = Math.floor(Math.random() * (max - min) + min);
    }
    var minute = Math.floor(Math.random() * 12) * 5;
    if (hour < 10) {
        hour = "0" + hour.toString();
    } else {
        hour = hour.toString();
    }
    if (minute < 10) {
        minute = "0" + minute.toString();
    } else {
        minute = minute.toString();
    }
    return hour + ":" + minute;
}

tasks = generateTasks(10);
console.log(tasks);
console.log(algorithm(tasks));