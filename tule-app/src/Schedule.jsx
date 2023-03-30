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
    day: 'Mon'
},
{
    taskName: "test same date task",
    duration: 2,
    priority: 3,
    day: 'Mon'
},
{
    taskName: "example task 2",
    duration: 4,
    priority: 2,
    day: 'Fri'
}]

const checkDate =(compareDate, date) => {
    return(
        compareDate == date
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
            <div className="grid2">
                {columnIndex.map((index) => index%2==0&&<div>
                    {activeHours.map((time) => <div className="gridSide" key={time}>{time}</div>)}
                </div>||
                <div>
                    {exampleTasks.map((task) => <div className="gridSide" key={task.taskName}>{task.taskName}</div>)}
                    </div>)
                }
            </div>
        </>
    );
}

export default Schedule;