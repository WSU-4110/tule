const TaskHandler = require('./TaskHandler');
const {ObjectId } = require('mongodb');
const {expect, test} = require('@jest/globals');

taskHandler = new TaskHandler();


taskTemplate = {
    "_id":'testid',
    "Name":"",
    "Duration":"",
    "StartTime":"",
    "BreakDuration":"",
    "Date":"yyyy-mm-dd",
    "Days":[],
    "Priority":"",
    "Recurrence":false
}

userTemplate = {
    "Username":"",
    "Password":"",
    "RecurringTasks":[],
    "ActiveTasks":[],
    "InactiveTasks":[],
    "Schedules":{"mmddyyyy":[]},
    "TaskArchive":[]   
}

testResult = {
    "Username":"",
    "Password":"",
    "RecurringTasks":[],
    "ActiveTasks":[],
    "InactiveTasks":['testid'],
    "Schedules":{"mmddyyyy":[]},
    "TaskArchive":[]   
}
test('Push a new task to the inactive tasks list', () => {
    expect(taskHandler.addNewTaskToInactive(userTemplate,taskTemplate)).toStrictEqual(testResult)
})

testUser = userTemplate;
testResult = userTemplate;
testUser['ActiveTasks'][0] = 'testid';
testResult['InactiveTasks'][0] = 'testid';
test('Make sure a task from ActiveTasks will be moved to inactive after editing', () => {
    expect(taskHandler.updateTaskOnUser(testUser,taskTemplate)).toStrictEqual(testResult);
})

testUser = userTemplate;
testResult = userTemplate;
testUser['RecurringTasks'][0] = 'testid';
testResult['InactiveTasks'][0] = 'testid';
test('Make sure task from recurring tasks gets sent to inactive if recurrence = false', () => {
    expect(taskHandler.updateTaskOnUser(testUser,taskTemplate)).toStrictEqual(testResult);
})

testUser = userTemplate;
testResult = userTemplate;
testTask = taskTemplate;
testUser['InactiveTasks'][0] = 'testid';
testResult['RecurringTasks'][0] = 'testid';
testTask['Recurrence'] = true;
test('Make sure recurring task from inactive tasks gets sent to recurring tasks', () => {
    expect(taskHandler.updateTaskOnUser(testUser,testTask)).toStrictEqual(testResult);
})

testUser = userTemplate;
testResult = userTemplate;
testTask = taskTemplate;
testUser['ActiveTasks'][0] = 'testid';
testResult['RecurringTasks'][0] = 'testid';
testTask['Recurrence'] = true;
test('Make sure recurring task from active tasks gets sent to recurring tasks', () => {
    expect(taskHandler.updateTaskOnUser(testUser,testTask)).toStrictEqual(testResult);
})

testUser = userTemplate;
testResult = userTemplate;
testTask = taskTemplate;
testUser['RecurringTasks'][0] = 'testid';
testResult['InactiveTasks'][0] = 'testid';
test('Make sure non recurring task from recurring tasks gets sent to inactive tasks', () => {
    expect(taskHandler.updateTaskOnUser(testUser,testTask)).toStrictEqual(testResult);
})

testUser = userTemplate;
testResult = userTemplate;
testSched = {
    'mmddyyyy': {
        "Tasks":[
            {"Id":"111111111111111111111111"},
            {"Id":"222222222222222222222222"},
            {"Id":"333333333333333333333333"}
        ]
    }
};
testUser['ActiveTasks'] = [
    new ObjectId('333333333333333333333333'),
    new ObjectId('444444444444444444444444'),
    new ObjectId('555555555555555555555555')
];
testUser['InactiveTasks'] = [
    new ObjectId('111111111111111111111111'),
    new ObjectId('222222222222222222222222')
];
testUser['Schedules'] = {
    "mmddyyyy": {
        "Tasks":[
            {"Id":'333333333333333333333333'},
            {"Id":'444444444444444444444444'},
            {"Id":'555555555555555555555555'}
        ]
    }
};
testResult['Schedules'] = testSched;
testResult['ActiveTasks'] = [
    new ObjectId('333333333333333333333333'),
    new ObjectId('111111111111111111111111'),
    new ObjectId('222222222222222222222222')
];
testResult['InactiveTasks'] = [
    new ObjectId('444444444444444444444444'),
    new ObjectId('555555555555555555555555')
]

test('testing newSched user clean for expected behavior', () => {
    expect(taskHandler.newSchedUserClean(testUser,testSched)).toStrictEqual(testResult);
})
