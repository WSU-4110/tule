import Banner from "./components/Banner";
import React, {useState} from "react"
import Navbar from "./components/Navbar";
import Button from 'react-bootstrap/Button';
function Schedule(props){
const [activeHours, setActiveHours] = useState([1, 2, 3, 4, 5, 6 ,7, 8, 9, 10, 11, 12]);
const [columnIndex, setColumnIndex] = useState([0, 1]);
const DAYS = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
const exampleTasks = [{
    taskName: "example task",
    duration: 2,
    priority: 3,
    startTime: 3,
    day: 'Mon'
},
{
    taskName: "test same date task",
    duration: 3,
    priority: 1,
    startTime: 6,
    day: 'Mon'
},
{
    taskName: "example task 2",
    duration: 1,
    priority: 2,
    startTime: 2,
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
            <h1>Week view</h1>
            <div className="grid">
                {DAYS.map((day) => <div className="gridHeader" key={day}>{day}</div>)}
                {(DAYS).map((day) => (
                    <div>
                        {exampleTasks.map((task) => (checkDate(task.day, day) && <Button key={task.taskName}>{task.taskName}</Button>))}
                    </div>
                ))}
                
            </div>
            <h1>Day view</h1>
            <div className="grid3">
            <div className="grid2">
                {activeHours.map((time) => <div className="gridSide" key={time}>{time}</div>)}
            </div>
            <div className="grid2">
                {activeHours.map((time) => <div className="gridSide" key={time}>
                    {exampleTasks.map((task) => (checkTime(task.startTime, time) && <div className={"task" + task.priority}>
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