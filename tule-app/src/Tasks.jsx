import TaskList from './components/TaskList'
import React from "react"

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
const editTask = (index, newName, newStartTime, newDuration, newPriority) =>{
    console.log("test");
    currentTasks[index].taskName = newName;
    currentTasks[index].startTime = newStartTime;
    currentTasks[index].duration = newDuration;
    currentTasks[index].priority = newPriority;
}
const Tasks = (props) => {
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
        currentTasks.push(newTask);
        console.log(currentTasks);
    }
    return(
        <form onSubmit={handleSubmit}>
            <h1>Task list Page</h1>
            <section>
                <TaskList ListOfTasks={currentTasks} editTask={editTask}/>
            </section>
            <button type="submit">Add task</button>
            <br></br>
            <button onClick={() => props.onChangeScreen('schedule')}>Create Schedule</button>
        </form>
    )
}

export default Tasks;