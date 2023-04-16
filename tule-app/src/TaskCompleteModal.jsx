import React, {useState} from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Multiselect from 'multiselect-react-dropdown';
import Form from 'react-bootstrap/Form';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function TaskCompleteModal(props) {
    const [show, setShow] = useState(true);
    
    const handleSubmit = () => {
        props.resetModal();
        setShow(false);
    }

    const completeTask = () => {
        props.task.Complete = true;
        handleSubmit();
    }

    const addTime = () => {
        props.task.Duration += 0.25;
        handleSubmit();
    }

    return (
        <>
            <Modal
                show={show}
                onHide={props.resetModal}
                backdrop="static"
                >
                <Modal.Header
                    closeButton
                    style={{
                        backgroundColor: '#F8F9FA',
                        borderBottom: '1px solid #E9ECEF',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Modal.Title>{props.task.Name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button onClick={() => completeTask()}>Mark as done</Button>
                    <Button onClick={() => addTime()}>Add 15 min</Button>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.resetModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}