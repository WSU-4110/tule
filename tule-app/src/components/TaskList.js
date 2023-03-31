import TaskComponent from './TaskComponent';

function TaskList(props){
    
    return <ul>
        {props.ListOfTasks.map((task) =>
        <TaskComponent key={task.id} id={task.id} taskName={task.taskName} duration={task.duration} priority={task.priority} 
        editTask={props.editTask} currentTasks={props.currentTasks} update={props.update}/>
        )}
    </ul>
}

export default TaskList;