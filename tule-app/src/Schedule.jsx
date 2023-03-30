import Banner from "./components/Banner";
import React, {useState} from "react"
import Navbar from "./components/Navbar";
import Button from 'react-bootstrap/Button';
function Schedule(props){
const [activeHours, setActiveHours] = useState([Array.from({length: 12})]);
const DAYS = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
const exampleTasks = [{
    taskName: "example task",
    duration: 2,
    priority: 3
},
{
    taskName: "example task 2",
    duration: 4,
    priority: 2
}]
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
        <div className="grid">
            {DAYS.map((day) => <div className="gridHeader" key={day}>{day}</div>)}
            {exampleTasks.map((task) => <Button key={task.taskName}>{task.taskName}</Button>)}
        </div>
        </>
    );
}

export default Schedule;