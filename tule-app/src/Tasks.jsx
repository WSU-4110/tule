import TaskList from './components/TaskList'
import React, { useState } from "react"
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from "react-bootstrap/Col";
import Navbar from "./components/Navbar";

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
            <Navbar text="Tule"/>
            <Form onSubmit={handleSubmit}>
                <h1>My Tasks</h1>
                <Col>
                    <TaskList ListOfTasks={currentTasks} editTask={editTask} currentTasks={currentTasks} update={setCurrentTasks}/>
                    <Button type="submit">
                        Add Task
                    </Button>
                    <Button onClick={() => props.onChangeScreen('schedule')}>
                        Create Schedule
                    </Button>
                </Col>
            </Form>
        </div>

        // <form onSubmit={handleSubmit}>
        //     <h1>Task list Page</h1>
        //     <section>
        //         <TaskList ListOfTasks={currentTasks} editTask={editTask} currentTasks={currentTasks} update={setCurrentTasks}/>
        //     </section>
        //     <button type="submit">Add task</button>
        //     <br></br>
        //     <button onClick={() => props.onChangeScreen('schedule')}>Create Schedule</button>
        // </form>
    )
}

export default Tasks;