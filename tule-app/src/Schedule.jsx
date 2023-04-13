//import Banner from "./components/Banner";
import React, {useState} from "react"
import Navbar from "./components/Navbar";
import Button from 'react-bootstrap/Button';
import ActiveHoursModal from './ActiveHoursModal';
import { ScheduleModal } from "./ScheduleModal";
import { useEffect
 } from "react";
 
function Schedule(props){
const [showAHModal, setShowAHModal] = useState(false);
const {showSCModal, setShowSCModal} = useState(false);
const [activeHours, setActiveHours] = useState(Array.from({length: (24-9)}, (_,i) => 9+i));
const DAYS = ['Sat', 'Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri'];
const [today] = useState(new Date());
const [displayedDay, setDisplayedDay] = useState(today);
const exampleTasks = [{
    taskName: "example task",
    duration: 2,
    priority: 3,
    startTime: 3+12,
    day: 'Tues'
},
{
    taskName: "test same date task",
    duration: 3,
    priority: 1,
    startTime: 6+12,
    day: 'Tues'
},
{
    taskName: "example task 2",
    duration: 1,
    priority: 2,
    startTime: 2+12,
    day: 'Fri'
},
{
    taskName: "test",
    duration: 1.5,
    priority: 2,
    startTime: 12,
    day: 'Tues'
}]

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
    console.log(getAllTasks());
})

const castDuration=(task) =>{
    return(Array.from({ length: Math.round(changeToMinutes(task.duration,0)/15) }, (_,i) => task.startTime+i*0.25))
}
const checkDate =(compareDate, date) => {
    return(
        compareDate === date
    )
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
    const tempDate = new Date();
    tempDate.setUTCDate(displayedDay.getUTCDay()+3)
    setDisplayedDay(tempDate);
}
const prevDay = () =>{
    const tempDate = new Date();
    tempDate.setUTCDate(displayedDay.getUTCDay() + 1)
    setDisplayedDay(tempDate);
}
const resetModal = () =>{
    setShowAHModal(false) 
}
    return(
        <>
            <ScheduleModal />
            {showAHModal && <ActiveHoursModal resetModal={resetModal} setActiveHours={setActiveHours} activeHours ={activeHours}/>}
            <div>
            <Navbar text='Tule'/>
            
            <button className="btn btn-primary mt-5" onClick={() => props.onChangeScreen('tasks')}>
                Back
            </button>
            <button className="btn btn-primary mt-5" onClick={() => props.onChangeScreen('')}>
               logout
            </button>
            <button className="btn btn-primary mt-5" onClick={() => setShowAHModal(true)}>
               change active hours
            </button>
            </div>
            <div className="dayDisplay">
            <Button onClick={() =>prevDay()}>{String.fromCharCode(8592)}</Button>
            {(!checkDate(displayedDay.getUTCDay(), today.getUTCDay()) && <h1>{DAYS[displayedDay.getUTCDay()]}</h1>) 
            || (checkDate(displayedDay.getUTCDay(), today.getUTCDay()) && <h1>Today</h1>)}
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
                        {exampleTasks.map((task) => (checkDate(task.day, DAYS[displayedDay.getUTCDay()]) && checkTime(changeToMinutes(task.startTime, 0), changeToMinutes(time, minute)) && <div className={"task" + task.priority} key={task.taskName + task.priority}>
                        {castDuration(task).map((index) => (
                        (index===castDuration(task)[0] &&
                            <div className={"task" +task.priority} key={time+minute+index+"button"}>
                            <Button className="taskButton" variant="outline-dark" vertical="true" size = "sm" key={task.taskName}>{task.taskName}</Button>
                            </div>)
                            ||
                            <div className={"task" +task.priority} key={time+minute+index}>
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