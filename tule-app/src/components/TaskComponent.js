import { EditTaskModal } from "../EditTaskModal";
import { useState } from "react";
import Button from 'react-bootstrap/Button';

function TaskComponent(props) {
   const [showModal, setShowModal] = useState(false);

    return(
        <>
            {showModal && <EditTaskModal key={props.id} id={props.id[4]}
            editTask={props.editTask} resetModal={setShowModal} currentTasks={props.currentTasks} update={props.update}/>}
            {/*<li className="mb-2 mt-5 no-list-style">
                <div>
                    <h3>{props.taskName}</h3>
                    <ul key={0}>{"Duration: " +props.duration}</ul>
                    <ul key={1}>{"Priority: "+props.priority}</ul>
                </div>
                <div className="mt-3">
                    <Button className='' type = 'reset' onClick={() => setShowModal(true)} >Edit Task</Button>
                </div>
    /li>*/}
                <div className="mb-2 mt-5">
                    <h3>{props.taskName}</h3>
                    <p key={0}>{"Duration: " +props.duration}</p>
                    <p key={1}>{"Priority: "+props.priority}</p>
                </div>
                <div className="mt-3 position-relative right-1">
                    <Button className='' type = 'reset' onClick={() => setShowModal(true)} >Edit Task</Button>
                </div>
        </>
    )
}

export default TaskComponent;