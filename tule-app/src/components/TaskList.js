import TaskComponent from './TaskComponent';

function TaskList(props){
    
    return (
    <ul>
        {props.ListOfTasks.map((task) =>
            <TaskComponent
                key={task._id}
                task={task}
                currentTasks={props.currentTasks}
                update={props.update}/>
        )}
    </ul>
    );
}

export default TaskList;