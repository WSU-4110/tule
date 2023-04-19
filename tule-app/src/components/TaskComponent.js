import { EditTaskModal } from "../EditTaskModal";
import { useState } from "react";
import Button from 'react-bootstrap/Button';
import editIcon from '../pics/icons8-edit-64.png';
import checkIcon from '../pics/icons8-checkmark-40.png';
import { UilPen } from '@iconscout/react-unicons'
import { MDBRow, MDBCol } from 'mdb-react-ui-kit';

function TaskComponent(props) {
   const [showModal, setShowModal] = useState(false);
   const [task, setTask] = useState(props.task);

    return(
        <>

            {showModal && <EditTaskModal key={props._id} editTask={props.editTask} resetModal={setShowModal} currentTasks={props.currentTasks} update={props.update}/>}
                <div className="mb-3">
                    <div className="container">
                        <div className="row align-items-start">
                            <div className="col-md-6 offset-md-4">
                            {/*<img style={{width:30, height: 30}} src={checkIcon} alt="check-mark icon"/>
                            <img stylerowheight: 30}} className="float-right" src={editIcon} alt=""/>   
    <h3 className="pl-3">{props.task.Name}</h3>*/}
                            <link className=""><img className="float-start" style={{width:30, height: 30}} src={checkIcon} alt="check-mark icon"/></link>
                            
                            <link className="" onClick={() => setShowModal(true)}><img className="float-start" style={{width:30, height: 30}} src={editIcon} alt="edit-pencil icon"/></link>
                            
                            <h3 className="float-start">{props.task.Name}</h3>
                            <br/>
                            </div>
                        </div>

                        {/*<Button className='' type = 'reset' onClick={() => setShowModal(true)}>Edit</Button>*/}
                    </div>
                </div>

                {/*<div className="">
=======
            {showModal && (
                <EditTaskModal
                    key={props._id}
                    resetModal={setShowModal}
                    currentTasks={props.currentTasks}
                    task={task}
                    update={props.update}/>
            )}

                <div className="mb-2 mt-5">
                    <div className="">
                        <img className="float-right" src={editIcon} alt=""/>   
                        <h3>{props.task.Name}</h3>
                    </div>
                    <Button className='' type = 'reset' onClick={() => setShowModal(true)}>Edit</Button>
                    {/*<p key={0}>{"Duration: " +props.task.Duration}</p>
                    <p key={1}>{"Priority: "+props.task.Priority}</p>
                </div>
                <div className="mt-3 position-relative right-1">
<<<<<<< HEAD
                    <Button className='' type = 'reset' onClick={() => setShowModal(true)} >Edit Task</Button>
                </div>*/}
        </>
    )
}

export default TaskComponent;