import { EditTaskModal } from "../EditTaskModal";
import { useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function TaskComponent(props) {
   const [showModal, setShowModal] = useState(false);

    return(
        <>
            {showModal && <EditTaskModal key={props.id} id={props.id[4]}
            editTask={props.editTask} resetModal={setShowModal} currentTasks={props.currentTasks} update={props.update}/>}
            <li>
                <Form>
                    <Form.Group controlId="tasksList">
                        <Form.Label>{props.taskName}</Form.Label>
                        <Form.Label>{"Duration: " +props.duration}</Form.Label>
                        <Form.Label>{"Priority: "+props.priority}</Form.Label>
                    </Form.Group>
                    <Button type = 'reset' onClick={() => setShowModal(true)} >Edit Task</Button>
                </Form>
                {/* <div>
                    <h3>{props.taskName}</h3>
                    <ul key={0}>{"Duration: " +props.duration}</ul>
                    <ul key={1}>{"Priority: "+props.priority}</ul>
                </div>
                <div>
                    <button type = 'reset' onClick={() => setShowModal(true)} >Edit Task</button>
                </div> */}
            </li>
        </>
    )
}

export default TaskComponent;