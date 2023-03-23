import TaskList from './components/TaskList'
import React, { useState } from "react"
import Button from 'react-bootstrap/Button';
import Navbar from './components/Navbar';
import banner from "./pics/sky.png"
import DropDownMenu from './components/DropDownMenu';

const Tasks = (props) => {
    const [currentTasks, setCurrentTasks] = useState([]);

    const editTask = (index, newName, newStartTime, newDuration, newPriority) =>{
    
        console.log("test");
        currentTasks[index].taskName = newName;
        currentTasks[index].startTime = newStartTime;
        currentTasks[index].duration = newDuration;
        currentTasks[index].priority = newPriority;
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("add a task")
        const newTask ={
            id: 'task' + currentTasks.length,
            taskName: 'Default taskname',
            startTime: '',
            duration: '00:00:00',
            priority: 'None'
        };
        setCurrentTasks([...currentTasks,newTask]);
        console.log(currentTasks);
    }
    return(
        <div>
            <Navbar text='Tule'/>
            <DropDownMenu/>
            <div className="container">
                <img className="width-100" src={banner} />
            </div>
            <form className='mt-5' onSubmit={handleSubmit}>
                <h1>Tasks</h1>
                <section >
                    <TaskList ListOfTasks={currentTasks} editTask={editTask} currentTasks={currentTasks} update={setCurrentTasks}/>
                </section>

                <div className=''>
                    {/*<button className='btn btn-primary mb-5 mt-5' type="submit">Add task</button>*/}
                    <Button variant="danger" className='mb-5 mt-5' type="submit">Add task</Button>
                    <br />
                    <button className='btn btn-secondary mt-5 mb-10' onClick={() => props.onChangeScreen('schedule')}>Create Schedule</button>
                </div>
                
            </form>
        </div>
    )
}

export default Tasks;