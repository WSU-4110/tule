import { EditTaskModal } from "../EditTaskModal";
import { useState, setOver} from "react";
import editIcon from '../pics/editPencil.png';
import checkIconLight from '../pics/checkmark-light.png';
import checkIconDark from '../pics/checkmark-dark.png';

function TaskComponent(props) {
   const [showModal, setShowModal] = useState(false);
   const [task, setTask] = useState(props.task);
    var complete = props.task.Complete;

    return(
        <>

{showModal && (
                <EditTaskModal
                    key={props._id}
                    resetModal={setShowModal}
                    currentTasks={props.currentTasks}
                    task={task}
                    update={props.update}/>
            )}
            {/*Task display*/}
                <div className="mb-3">
                    <div className="container">
                        <div className="row align-items-start">
                            <div className="col-md-6 offset-md-5">
                                <img data-testid="checkmark" style={{width:30, height: 30}} className="float-start" src={complete ? checkIconDark : checkIconLight}/>
                                <img data-testid="edit-btn" title="Edit Task" onClick={() => setShowModal(true)} className="float-start task-icon" style={{width:30, height: 30}} src={editIcon} alt="edit-pencil icon"/>
                                <h3 data-testid="name" className="float-start">{props.task.Name}</h3>
                                <br/>
                            </div>
                        </div>
                    </div>
                </div>
        </>
    )
}

export default TaskComponent;