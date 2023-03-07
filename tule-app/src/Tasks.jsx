import React, { useState } from "react"

const Tasks = (props) => {
    const handleSubmit = () => {
        console.log("add a task")
    }
    return(
        <form onSubmit={handleSubmit}>
            <h1>Task list Page</h1>
            <br></br>
            <input type={"checkbox"}></input>
            <label>Task1</label>
            <br></br>
            <button type="submit">Add task</button>
            <br></br>
            <button onClick={() => props.onChangeScreen('schedule')}>Create Schedule</button>
        </form>
    )
}

export default Tasks;