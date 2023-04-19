import { EditTaskModal } from "../EditTaskModal";
import { useState } from "react";
import Button from 'react-bootstrap/Button';
import editIcon from '../pics/icons8-edit-64.png';
import checkIcon from '../pics/icons8-checkmark-40.png';
import { UilPen } from '@iconscout/react-unicons'
import { MDBRow, MDBCol } from 'mdb-react-ui-kit';

function TaskComponent(props) {
   const [showModal, setShowModal] = useState(false);

    return(
        <>
            {showModal && <EditTaskModal key={props._id} editTask={props.editTask} resetModal={setShowModal} currentTasks={props.currentTasks} update={props.update}/>}
                <div className="mb-4 ">
                    <div className="center">
                        <div className="flex">
                            {/*<img style={{width:30, height: 30}} src={checkIcon} alt="check-mark icon"/>
                            <img style={{width:30, height: 30}} className="float-right" src={editIcon} alt=""/>   
    <h3 className="pl-3">{props.task.Name}</h3>*/}
                            <img style={{width:30, height: 30}} src={checkIcon} alt="check-mark icon"/>
                            
                            <img style={{width:30, height: 30}} className="float-right" src={editIcon} alt=""/>   
                            
                            <h3 className="pl-3">{props.task.Name}</h3>
                        </div>
                        {/*<Button className='' type = 'reset' onClick={() => setShowModal(true)}>Edit</Button>*/}
                    </div>
                </div>

                {/*<div className="">
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
                    <Button className='' type = 'reset' onClick={() => setShowModal(true)} >Edit Task</Button>
                </div>*/}
        </>
    )
}

export default TaskComponent;