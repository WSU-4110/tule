import { EditTaskModal } from "../EditTaskModal";
import { useState } from "react";

function TaskComponent(props) {
   const [showModal, setShowModal] = useState(false);

    return(
        <>
            {showModal && <EditTaskModal/>}
            <li>
                <div>
                    <h3>{props.taskName}</h3>
                    <ul key={0}>{"Duration: " +props.duration}</ul>
                    <ul key={1}>{"Priority: "+props.priority}</ul>
                </div>
                <div>
                    <button onClick={() => setShowModal(true)} >Edit Task</button>
                </div>
            </li>
        </>
    )
}

export default TaskComponent;