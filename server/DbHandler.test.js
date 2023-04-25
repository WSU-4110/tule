require("dotenv").config()
const DbHandler = require('./DbHandler');
const {expect, test} = require('@jest/globals');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const dbHandler = new DbHandler();
const uri = process.env.MONGO_CONNECTION
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
}
client = new MongoClient(uri, mongoOptions)
client.connect();
db = client.db('Tule');
usersCollection = db.collection('Users');

loginTest = {
    "body":{
        "Username":"TestUser",
        "Password":"TestPass"
    }
}

test('Check loginVerify works with good data', () => {
    dbHandler.loginVerify(loginTest).then(info => {
        expect(info).toBe({"LoginSuccess":"True"})
    })
})

// loginTest = {
//     "body":{
//         "Username":"TestUser",
//         "Password":"TestPassWrong"
//     }
// }

// test('Check loginVerify fails on bad password', () => {
//     dbHandler.loginVerify(loginTest).then(info => {
//         expect(info).toBe({"LoginSuccess":"False",
//         "Error":"Incorrect Password"})
//     })
// })

// loginTest = {
//     "body":{
//         "Username":"TestUserWrong",
//         "Password":"TestPass"
//     }
// }

// test('Check loginVerify fails on bad username', () => {
//     dbHandler.loginVerify(loginTest).then(info => {
//         expect(info).toBe({"Error":"Username not found"})
//     })
// })

// loginTest = {
//     "body":{
//         "Username":"DuplicateUser",
//         "Password":"TestPass"
//     }
// }

// test('Check loginVerify fails when there are duplicate usernames in the database', () => {
//     dbHandler.loginVerify(loginTest).then(info => {
//         expect(info).toBe({"LoginSuccess":"False",
//         "Error":"Duplicate usernames exist"})
//     })
// })

loginTest = {
    "body":{
        "Username":"UnitTestUser",
        "Password":"UnitTestPass0"
    }
}
testResult = {
    "_id": new ObjectId('6434b733b01351c479f52ee9'),
    "Username":"UnitTestUser",
    "Password":"UnitTestPass0",
    "RecurringTasks":[],
    "ActiveTasks":[new ObjectId("64321f8d3399494eb523cf9d")],
    "InactiveTasks":[new ObjectId("64321deb3fa61c0d11770a49")],
    "Schedules":{},
    "TaskArchive":[]
}

test('Check getUserTasks is returning the user data', () => {
    dbHandler.getUserTasks(loginTest).then(info => {
        expect(info).toStrictEqual(testResult);
    })
})

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
testUser["_id"] = new ObjectId('6434c352b01351c479f52eeb')
testUser['Username']='UnitTestUser2';
testUser['Password']='UnitTestPass0';
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

testReq = {
    "body":{
        "Schedule":testSched
    }
}

usersCollection.replaceOne({Username:testUser["Username"]},testUser)

// test('Testing altTask route for expected functionality', () => {
//     dbHandler.altTask(testReq).then(data => {
//         expect(data).toStrictEqual(testResult)
//     })
// })
