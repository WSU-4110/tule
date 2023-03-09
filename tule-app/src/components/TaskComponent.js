function TaskComponent(props){
    return(
        <li>
            <div>
                <h3>{props.taskName}</h3>
                <ul key={0}>{"Duration: " +props.duration}</ul>
                <ul key={1}>{"Priority: "+props.priority}</ul>
            </div>
            <div>
                <button>Edit Task</button>
            </div>
        </li>
    )
}

export default TaskComponent;