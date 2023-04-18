import { EditTaskModal } from "../EditTaskModal";
import { useState } from "react";
import Button from 'react-bootstrap/Button';

function TaskComponent(props) {
   const [showModal, setShowModal] = useState(false);
   const [task, setTask] = useState(props.task);

    return(
        <>
            {showModal && (
                <EditTaskModal
                    key={props._id}
                    editTask={props.editTask}
                    resetModal={setShowModal}
                    currentTasks={props.currentTasks}
                    task={task}
                    update={props.update}/>
            )}
                <div className="mb-2 mt-5">
                    <h3>{props.task.Name}</h3>
                    {/*<p key={0}>{"Duration: " +props.task.Duration}</p>
                    <p key={1}>{"Priority: "+props.task.Priority}</p>*/}
                </div>
                <div className="mt-3 position-relative right-1">
                    <Button
                        className=''
                        type='reset'
                        onClick={() => setShowModal(true)}
                        >
                        Edit Task
                    </Button>
                </div>
        </>
    )
}

export default TaskComponent;