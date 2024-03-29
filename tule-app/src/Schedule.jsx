//import Banner from "./components/Banner";
import React, {useState, useEffect} from "react"
import Navbar from "./components/Navbar";
import Button from 'react-bootstrap/Button';
import { ScheduleModal } from "./ScheduleModal";
import DateHandler from "./DateHandler";
import TaskCompleteModal from "./TaskCompleteModal";
 
function Schedule(props){
const [showSCModal, setShowSCModal] = useState(true);
const [showTCModal, setShowTCModal] = useState(false);
const [activeHours, setActiveHours] = useState(Array.from({length: (24-9)}, (_,i) => 9+i));
const DAYS = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
const [today] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
const [displayedDay, setDisplayedDay] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
const [taskList, setTaskList] = useState([]);
const [modalTitle, setModalTitle] = useState("Create Schedule");
const [createdSchedules, setCreatedSchedules] = useState([[{StartTime: "15:00"}]]);
const dateHandler = new DateHandler();
const [selectedTask, setSelectedTask] = useState({});
const exampleTasks = [{
    taskName: "example task",
    duration: 2,
    priority: 3,
    startTime: 3+12,
    date: Date(2023, 4, 11)
},
{
    taskName: "test same date task",
    duration: 3,
    priority: 1,
    startTime: 6+12,
    date: Date(2023, 4, 11)
},
{
    taskName: "example task 2",
    duration: 1,
    priority: 0,
    startTime: 2+12,
    date: Date(2022, 5, 12)
},
]

async function getAllTasks(){
    try{
        const response = await fetch("http://localhost:3001/GetAllTasks",{
            method:'POST',
            mode:'cors',
            headers:{
            "Access-Control-Allow-Origin":'http://localhost:3000',
            "Content-Type":'application/json' 
            },
            body:JSON.stringify({
                "Username":sessionStorage["Username"],
                "Password":sessionStorage["Password"]
            })
        })
        return await response.json();
    }
    catch(err){
        console.log(err);
    }
}

useEffect(() => {
    const fetchData = async () => {
        const value = await getAllTasks()
        setCreatedSchedules(value.Schedules);
        setTaskList(value.ActiveTasks);
    }
    fetchData().catch(console.error);
}
    ,[displayedDay]
)

const castDuration=(task) =>{
    return(Array.from({ length: Math.round(findTask(task['_id']).Duration*4) }, (_,i) => parseInt(task.SchedStartTime.split(":")[0])+i*0.25))
}

const checkDate =(compareDate, date) => {
    var d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var d2 = new Date(compareDate)
    return (d1.getDate() === d2.getDate()
    && d1.getMonth() === d2.getMonth()
    && d1.getFullYear() === d2.getFullYear());
}

const checkTime =(compareTime, time) => {
    if(compareTime === time){
        return true;
    }
    return false;
}

const changeToMinutes = (input)=>{
    var hr = 0;
    var min = 0;
    if(typeof input == 'string'){
        hr = parseInt(input.split(':')[0]);
        min = parseInt(input.split(':')[1]);
        
    }
    return(hr * 60 + roundDown15(min))
    
    
}

const changeTime12hr =(time24, minute) =>{
    var output = "";
    if(time24 === 0 || time24 === 12){
        output ="12";
    }
    else{
        output = "" + time24%12;
    }
    output += ":" +minute;
    if(minute === 0){
        output+= "0";
    }
    if(time24 <12){
        output+= "am";
    }
    else{
        output+= "pm";
    }
    return output;
}

const nextDay = () =>{
    const tempDate = new Date(displayedDay.getFullYear(), displayedDay.getMonth(), displayedDay.getDate()+1);
    setDisplayedDay(tempDate);
}

const prevDay = () =>{
    const tempDate = new Date(displayedDay.getFullYear(), displayedDay.getMonth(), displayedDay.getDate()-1);
    setDisplayedDay(tempDate);
}
const todaySchedule = () =>{
    for(var i = 0; i<Object.keys(createdSchedules).length; i++){
        if(dateHandler.schedKeyToDate(Object.keys(createdSchedules)[i]).getDate() === displayedDay.getDate()
        && dateHandler.schedKeyToDate(Object.keys(createdSchedules)[i]).getFullYear() === displayedDay.getFullYear()
        && dateHandler.schedKeyToDate(Object.keys(createdSchedules)[i]).getMonth() === displayedDay.getMonth()){
            
            return(createdSchedules[Object.keys(createdSchedules)[i]]["Tasks"]);
            break;
        }
    }
    return([]);
}
const findTask = (id) =>{
    for(let i= 0; i<taskList.length; i++){
        if(String(taskList[i]._id) === String(id)){
            console.log(taskList);
            console.log(taskList[i]);
            return taskList[i];
        }
    }
}

const roundDown15 = (start) =>{
    return start - (start %15);
}

const resetModal = () =>{
    setShowSCModal(false) 
    setShowTCModal(false)
}

const handleTaskButton =(task) =>{
    setSelectedTask(task);
    setShowTCModal(true);
}

const editSchedule = () =>{
    setModalTitle("Edit Schedule");
    setShowSCModal(true);
}

    return(
        <>
            {showSCModal && 
                <ScheduleModal
                    resetModal={resetModal}
                    setActiveHours={setActiveHours} 
                    activeHours={activeHours}
                    title={modalTitle}
                    displayedDay={displayedDay}
                    />}
            {showTCModal && <TaskCompleteModal resetModal={resetModal}  task={selectedTask}/>}
            <div>
                <Navbar text='Tule'/>
            
                <div className="container mb-1">
                    <div className="row">
                        <div className="col-8 center offset-1">
                            <button data-testid="backBtn" className="btn btn-primary mt-5" onClick={() => props.onChangeScreen('tasks')}>
                                Back
                            </button>
                            <button data-testid="logBtn" className="btn btn-primary mt-5" onClick={() => props.onChangeScreen('')}>
                            Logout
                            </button>
                            <button data-testid="activeBtn" className="btn btn-primary mt-5" onClick={editSchedule}>
                            Edit Schedule
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div data-testid="dayDisplay" className="dayDisplay">
            <Button onClick={() =>prevDay()}>{String.fromCharCode(8592)}</Button>
            {(!checkDate(displayedDay, today) && <h1>{DAYS[displayedDay.getDay()]} {displayedDay.getMonth() +1}/{displayedDay.getDate()}</h1>) 
            || (checkDate(displayedDay, today) && <h1>Today {displayedDay.getMonth() +1}/{displayedDay.getDate()}</h1>)}
            <Button onClick={() =>nextDay()}>{String.fromCharCode(8594)}</Button>
            </div>
            <div className="grid3">
            <div data-testid="timeScale" className="grid2">
                {activeHours.map((time) =>
                    <div className="gridSide" key={time}>
                        {[0, 15, 30, 45].map((minute) => <div  className="gridSide" key={"h"+time+minute}>
                            {changeTime12hr(time, minute)}
                        </div>)}
                    </div>)}
            </div>
            <div data-testid="taskEntries" className="grid2">
                {activeHours.map((time) => <div className="gridData" key={"d"+time}>
                    {["00", "15", "30", "45"].map((minute) => <div  className="gridDataHeader" key={"d"+time+minute}>
                        {todaySchedule().map((task) => (
                            checkTime(changeToMinutes(task.SchedStartTime), changeToMinutes(time + ":" + minute)) &&
                            <div className={"task" + findTask(task._id).Priority} key={findTask(task._id).Name + findTask(task._id).Priority}>
                                {castDuration(task).map((index) => (
                                (index===castDuration(task)[0] &&
                                    <div className={(!findTask(task._id).Complete && "task" +findTask(task._id).Priority) || (findTask(task._id).Complete && "taskComplete")} key={time+minute+index+"button"}>
                                        <Button className="taskButton" variant="outline-dark" vertical="true" size = "sm" key={findTask(task._id).Name} onClick={()=> handleTaskButton(findTask(task._id))}>{findTask(task._id).Name}</Button>
                                    </div>)
                                ||
                                    <div className={(!findTask(task._id).Complete && "task" +findTask(task._id).Priority) || (findTask(task._id).Complete && "taskComplete")} key={time+minute+index}>
                                    </div>))}
                            </div>
                            ))}
                        
                    </div>)}
                </div>)}
                
            </div>
            </div>
        </>
    );
}

export default Schedule;