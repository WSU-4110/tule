//import Banner from "./components/Banner";
import React, {useState, useEffect} from "react"
import Navbar from "./components/Navbar";
import Button from 'react-bootstrap/Button';
import { ScheduleModal } from "./ScheduleModal";
 
function Schedule(props){
const [showSCModal, setShowSCModal] = useState(true);
const [activeHours, setActiveHours] = useState(Array.from({length: (24-9)}, (_,i) => 9+i));
const DAYS = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
const [today] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
const [displayedDay, setDisplayedDay] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
const [taskList, setTaskList] = useState([]);
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
    var result = getAllTasks();
    result.then((value) => {
        setTaskList(value.InactiveTasks);
        console.log(taskList);
    })
}
    ,[activeHours]
)

const castDuration=(task) =>{
    return(Array.from({ length: Math.round(changeToMinutes(task.Duration,0)/15) }, (_,i) => parseInt(task.StartTime.Time.split(":")[0])+i*0.25))
}
const checkDate =(compareDate, date) => {
    //console.log("compare date" + compareDate);
    var d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var d2 = new Date(compareDate)
    //console.log(d1);
    //console.log("date 3 " + d3);
    return (d1.getDate() === d2.getDate()
    && d1.getMonth() === d2.getMonth()
    && d1.getFullYear() === d2.getFullYear());
}
const checkTime =(compareTime, time) => {
    return(
        compareTime === time
    )
}
const changeToMinutes = (hr, min)=>{
    return(hr * 60 + min)
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
const resetModal = () =>{
    setShowSCModal(false) 
}
    return(
        <>
            {showSCModal && <ScheduleModal resetModal={resetModal} setActiveHours={setActiveHours} activeHours ={activeHours}/>}
            <div>
            <Navbar text='Tule'/>
            
            <button className="btn btn-primary mt-5" onClick={() => props.onChangeScreen('tasks')}>
                Back
            </button>
            <button className="btn btn-primary mt-5" onClick={() => props.onChangeScreen('')}>
               logout
            </button>
            <button className="btn btn-primary mt-5" onClick={() => setShowSCModal(true)}>
               change active hours
            </button>
            </div>
            <div className="dayDisplay">
            <Button onClick={() =>prevDay()}>{String.fromCharCode(8592)}</Button>
            {(!checkDate(displayedDay, today) && <h1>{DAYS[displayedDay.getDay()]}</h1>) 
            || (checkDate(displayedDay, today) && <h1>Today</h1>)}
            <Button onClick={() =>nextDay()}>{String.fromCharCode(8594)}</Button>
            </div>
            <div className="grid3">
            <div className="grid2">
                {activeHours.map((time) =>
                    <div className="gridSide" key={time}>
                        {[0, 15, 30, 45].map((minute) => <div  className="gridSide" key={"h"+time+minute}>
                            {changeTime12hr(time, minute)}
                        </div>)}
                    </div>)}
            </div>
            <div className="grid2">
                {activeHours.map((time) => <div className="gridData" key={"d"+time}>
                    {[0, 15, 30, 45].map((minute) => <div  className="gridDataHeader" key={"d"+time+minute}>
                        {taskList.map((task) => (checkDate(task.Date.Time, displayedDay) && checkTime(changeToMinutes(parseInt(task.StartTime.Time.split(":")[0]), parseInt(task.StartTime.Time.split(":")[1])), changeToMinutes(time, minute)) && <div className={"task" + task.Priority} key={task.Name + task.Priority}>
                        {castDuration(task).map((index) => (
                        (index===castDuration(task)[0] &&
                            <div className={"task" +task.Priority} key={time+minute+index+"button"}>
                            <Button className="taskButton" variant="outline-dark" vertical="true" size = "sm" key={task.Name}>{task.Name}</Button>
                            </div>)
                            ||
                            <div className={"task" +task.Priority} key={time+minute+index}>
                            </div>))}
                        </div>))}
                    </div>)}
                </div>)}
                
            </div>
            </div>
        </>
    );
}

export default Schedule;