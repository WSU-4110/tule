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
const Tasks = (props) => {
    const handleSubmit = () => {
        console.log("add a task")
    }
    return(
        <form onSubmit={handleSubmit}>
            <h1>Task list Page</h1>
            <section>
                <TaskList ListOfTasks={currentTasks} />
            </section>
            <button type="submit">Add task</button>
            <br></br>
            <button onClick={() => props.onChangeScreen('schedule')}>Create Schedule</button>
        </form>
    )
}

export default Tasks;