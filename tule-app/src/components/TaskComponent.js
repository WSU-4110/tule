import { EditTaskModal } from "../EditTaskModal";
import { useState } from "react";
import Button from 'react-bootstrap/Button';
import editIcon from '../pics/editPencil.png';
import checkIcon from '../pics/checkbox-blue.png';
import { UilPen } from '@iconscout/react-unicons'
import { MDBRow, MDBCol } from 'mdb-react-ui-kit';

function TaskComponent(props) {
   const [showModal, setShowModal] = useState(false);
   const [task, setTask] = useState(props.task);

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
                <div className="mb-3">
                    <div className="container">
                        <div className="row align-items-start">
                            <div className="col-md-6 offset-md-5">
                           <img className="float-start" style={{width:30, height: 30}} src={checkIcon} alt="check-mark icon"/>
                            
                            <img onClick={() => setShowModal(true)} className="float-start task-icon" style={{width:30, height: 30}} src={editIcon} alt="edit-pencil icon"/>
                            
                            <h3 className="float-start">{props.task.Name}</h3>
                            <br/>
                            </div>
                        </div>

                        {/*<Button className='' type = 'reset' onClick={() => setShowModal(true)}>Edit</Button>*/}
                    </div>
                </div>
        </>
    )
}

export default TaskComponent;