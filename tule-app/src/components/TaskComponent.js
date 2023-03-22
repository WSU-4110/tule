import { EditTaskModal } from "../EditTaskModal";
import { useState } from "react";

function TaskComponent(props) {
   const [showModal, setShowModal] = useState(false);
   const [newInfo, setNewInfo] = useState('');

    return(
        <>
            {showModal && <EditTaskModal key={props.id} id={props.id[4]}
            editTask={props.editTask}/>}
            <li>
                <div>
                    <h3>{props.taskName}</h3>
                    <ul key={0}>{"Duration: " +props.duration}</ul>
                    <ul key={1}>{"Priority: "+props.priority}</ul>
                </div>
                <div>
                    <button type = 'reset' onClick={() => setShowModal(true)} >Edit Task</button>
                </div>
            </li>
        </>
    )
}

export default TaskComponent;