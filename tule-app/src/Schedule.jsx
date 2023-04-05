import Banner from "./components/Banner";
import React, {useState} from "react"
import Navbar from "./components/Navbar";
import Button from 'react-bootstrap/Button';
function Schedule(props){
const [activeHours, setActiveHours] = useState([11, 12, 13, 14, 15, 16, 17, 18 ,19, 20, 21, 22, 23, 0]);
const [columnIndex, setColumnIndex] = useState([0, 1]);
const [timeScale, setTimeScale] = useState(60);
const DAYS = ['Sat', 'Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri'];
const [today, setToday] = useState(new Date());
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
}]

const castDuration=(task) =>{
    var arrayOfDuration =[];
    for(var i = task.startTime; i< (task.duration + task.startTime); i++){
        arrayOfDuration = [...arrayOfDuration, i];
    }
    return(arrayOfDuration)
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
const changeTime12hr =(time24) =>{
    if(time24 == 0){
        return(12+"am")
    }
    if(time24<12){
        return(time24+"am")
    }
    if(time24 == 12){
        return(12+"pm")
    }
    return(time24%12 + "pm")
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
    return(
        <>
            <div>
            <Navbar text='Tule'/>
            
            <button className="btn btn-primary mt-5" onClick={() => props.onChangeScreen('tasks')}>
                Back
            </button>
            <button className="btn btn-primary mt-5" onClick={() => props.onChangeScreen('')}>
               logout
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
                {activeHours.map((time) => <div className="gridSide" key={time}>{changeTime12hr(time)}</div>)}
            </div>
            <div className="grid2">
                {activeHours.map((time) => <div className="gridSide" key={time}>
                    {exampleTasks.map((task) => (checkDate(task.day, DAYS[displayedDay.getUTCDay()]) && checkTime(task.startTime, time) && <div className={"task" + task.priority}>
                    {castDuration(task).map((index) => (
                        index===castDuration(task)[0] &&
                        <div className={"task" +task.priority}>
                            <Button className="taskButton" variant="outline-dark" vertical="true" key={task.taskName}>{task.taskName}</Button>
                        </div>
                        ||
                        <div className={"task" +task.priority}>
                        </div>))}
                    </div>))}
                </div>)}
                
            </div>
            </div>
        </>
    );
}

export default Schedule;