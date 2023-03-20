import TaskList from './components/TaskList'
import React, { useState } from "react"

const currentTasks = [
    {
        id: 'task0',
        taskName: 'Software Engineering class',
        startTime: '4:00pm',
        duration: '01:15:00',
        priority: 'High'
    },
    {
        id: 'task1',
        taskName: 'Software Engineering homework',
        startTime: '',
        duration: '01:30:00',
        priority: 'Medium'
    }
]
const Tasks = (props) => {
    const [newTaskName, setNewTaskName]= useState('');
    const [newTaskDuration, setNewTaskDuration]= useState('');
    const [newTaskPriority, setNewTaskPriority]= useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("add a task")
        const newTask ={
            id: 'task' + currentTasks.length,
            taskName: newTaskName,
            startTime: '',
            duration: newTaskDuration,
            priority: newTaskPriority
        };
        currentTasks.push(newTask);
        console.log(currentTasks);
    }

    return(
        <form onSubmit={handleSubmit}>
            <h1>Task list Page</h1>
            <section>
                <TaskList ListOfTasks={currentTasks} />
            </section>
            <input value={newTaskName} onChange={(n) => setNewTaskName(n.target.value)} placeholder={'taskName'}></input>
            <input value={newTaskDuration} onChange={(d) => setNewTaskDuration(d.target.value)} placeholder={'duration'}></input>
            <input value={newTaskPriority} onChange={(p) => setNewTaskPriority(p.target.value)} placeholder={'priority'}></input>
            <button type="submit">Add task</button>
            <br></br>
            <button onClick={() => props.onChangeScreen('schedule')}>Create Schedule</button>
        </form>
    )
}

export default Tasks;