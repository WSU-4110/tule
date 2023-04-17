import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Multiselect from 'multiselect-react-dropdown';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import './EditTaskModal.css'

export function EditTaskModal(props) {
    const [taskName, setTaskName] = useState(props.currentTasks[props.id].taskName);
    const [taskDuration, setTaskDuration] = useState(props.currentTasks[props.id].duration);
    const [taskDurationHours, setTaskDurationHours] = useState(props.currentTasks[props.id].duration.split(':')[0]);
    const [taskDurationMinutes, setTaskDurationMinutes] = useState(props.currentTasks[props.id].duration.split(':')[1]);
    const [taskBreakDurationBool, setTaskBreakDurationBool] = useState(false);
    const [taskBreakDuration, setTaskBreakDuration] = useState('');
    const [taskBreakDurationHours, setTaskBreakDurationHours] = useState(0);
    const [taskBreakDurationMinutes, setTaskBreakDurationMinutes] = useState(0);
    const [taskDateBool, setTaskDateBool] = useState(false);
    const [taskDate, setTaskDate] = useState(props.currentTasks[props.id].date);
    const [taskStartTimeBool, setTaskStartTimeBool] = useState(false);
    const [taskStartTime, setTaskStartTime] = useState(props.currentTasks[props.id].startTime);
    const [taskPriority, setTaskPriority] = useState(props.currentTasks[props.id].priority);
    const [reccuringDays, setReccuringDays] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const daysOfWeek = [
          { name: 'Sunday', id: 0 },
          { name: 'Monday', id: 1 },
          { name: 'Tuesday', id: 2 },
          { name: 'Wednesday', id: 3 },
          { name: 'Thursday', id: 4 },
          { name: 'Friday', id: 5 },
          { name: 'Saturday', id: 6 },
        ];
    const [show, setShow] = useState(true);
    const handleClose = () => {
        setShow(false);
        console.log(taskStartTime);
        props.resetModal(false);
    }
    const onSelect = (selectedItem) => {
        reccuringDays.push(selectedItem);
    }
    const onRemove = (selectedItem) => {
        reccuringDays.pop(selectedItem);
    }

    // Handles form submission.
    // Checks if all conditions are met.
    const handleSubmit = (e) => {
        e.preventDefault();
        setTaskDuration(taskDurationHours + ':' + taskDurationMinutes);
        setTaskBreakDuration(taskBreakDurationHours + ':' + taskBreakDurationMinutes);
        if (taskName !== '') {
            if (taskDuration !== '') {
                if (taskDate !== '') {
                    if (taskPriority === '') {
                        setTaskPriority(0)
                    }
                    if (taskStartTime !== '') {
                        setTaskStartTimeBool(true);
                    }
                    if (taskBreakDuration !== '') {
                        setTaskBreakDurationBool(true);
                    }
                    if (taskDate !== '') {
                        setTaskDateBool(true);
                    }
                    setShow(false);
                } else {
                    setErrorMessage('Please enter date');
                    setShowAlert(true);
                }
            } else {
                setErrorMessage('Please enter duration');
                setShowAlert(true);
            }
        } else {
            setErrorMessage('Please enter task name');
            setShowAlert(true);
        }
        console.log(taskName);
        console.log(taskDuration);
        console.log(taskDurationHours + ":" + taskDurationMinutes);
        console.log(props.id);
        const newTask = {
            _id: "",
            Name: taskName,
            StartTime: {
                Active: taskStartTime != "",
                Time: taskStartTime}
                ,
            Duration: parseFloat(taskDurationHours) + parseFloat(taskDurationMinutes)/60,
            Break: {
                Active: taskBreakDuration!= 0 && taskBreakDuration!=0,
                Time: parseFloat(taskBreakDurationHours) + parseFloat(taskBreakDurationMinutes)/60
            },
            Date: {
                Active: taskDate != "", 
                Time: new Date(taskDate)}
                ,
            Reccurence: reccuringDays,
            Priority: parseInt(taskPriority),
            Location: "",
            Complete: false
        }
        props.editTask(props.id,taskName,taskStartTime,taskDurationHours + ":" + taskDurationMinutes,taskPriority);
        props.resetModal(false);
        props.update([...props.currentTasks])
    }

    function millisecondsToString(milliseconds) {
        let minutes = (milliseconds / 1000) / 60;
        let hours = minutes / 60;
        if (hours < 10) {
            hours = '0' + hours.toString();
        } else {
            hours = hours.toString();
        }
        if (minutes < 10) {
            minutes = '0' + minutes.toString();
        } else {
            minutes = minutes.toString();
        }
        return (hours + ':' + minutes);
    }
    
    return(
        <>
            <Modal
                show={show}
                onHide={handleClose}
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
                    <Modal.Title>Edit Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showAlert && (
                        <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                            <Alert.Heading>Error Editing Task</Alert.Heading>
                                <p> {errorMessage} </p>
                        </Alert>
                    )}
                    <Form>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formBasicEmail">
                                <Form.Label>Task Name</Form.Label>
                                <Form.Control
                                    defaultValue = {props.currentTasks[props.id].taskName}
                                    type="text"
                                    placeholder="Enter task name"
                                    onChange={(u) => setTaskName(u.target.value)}
                                    autoFocus
                                    />
                            </Form.Group>

                            <Form.Group
                                as={Col}
                                controlId="formBasicPassword"
                                disabled={!taskStartTimeBool}
                                >
                                <Form.Label>Start Time</Form.Label>
                                <Form.Control
                                    defaultValue = {props.currentTasks[props.id].startTime}
                                    type="time"
                                    
                                    onChange={(u) => setTaskStartTime(u.target.value)}
                                    required
                                    />
                                <Form.Text muted>
                                    Optional
                                </Form.Text>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="taskDurationGroup">
                            <Form.Label>Task Duration</Form.Label>
                                <Row className="taskDurationRow">
                                    <Col className='durationInput' >
                                        <Form.Control
                                        defaultValue = {props.currentTasks[props.id].duration.split(':')[0]}
                                        type='number'
                                        min='0'
                                        max='24'
                                        onChange={(u) => setTaskDurationHours(u.target.value)}
                                        />
                                        
                                        <Form.Text muted>
                                            Hours
                                        </Form.Text>
                                    </Col>

                                    <Col className='timeColon' >
                                        <Form.Label>:</Form.Label>
                                    </Col>

                                    <Col className='durationInput' >
                                        <Form.Control
                                            defaultValue = {props.currentTasks[props.id].duration.split(':')[1]}
                                            type='number'
                                            min='0'
                                            max='60'
                                            onChange={(u) => setTaskDurationMinutes(u.target.value)}
                                            />
                                        <Form.Text muted>
                                            Minutes
                                        </Form.Text>
                                    </Col>
                                </Row>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formBasicPassword">
                                <Form.Label>Break Duration</Form.Label>
                                <Row className="break duration">
                                    <Col sm={5} >
                                    <Form.Control
                                    type='number'
                                    min='0'
                                    max='24'
                                    onChange={(u) => setTaskBreakDurationHours(u.target.value)}
                                    />
                                    <Form.Text muted>
                                        Hours
                                    </Form.Text>
                                    </Col>

                                    <Col sm={1} >
                                    <Form.Label>:</Form.Label>
                                    </Col>

                                    <Col sm={5} >
                                    <Form.Control
                                        type='number'
                                        min='0'
                                        max='60'
                                        onChange={(u) => setTaskBreakDurationMinutes(u.target.value)}
                                        />
                                    <Form.Text muted>
                                        Minutes
                                    </Form.Text>
                                    </Col>
                                </Row>
                                <Form.Text className="text-muted">
                                    Optional
                                </Form.Text>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formBasicPassword">
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    onChange={(u) => setTaskDate(u.target.value)}
                                    />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formBasicPassword">
                                <Form.Label>Reccuring Days</Form.Label>
                                <Multiselect
                                    options={daysOfWeek} // Options to display in the dropdown
                                    selectedValues={reccuringDays} // Preselected value to persist in dropdown
                                    onSelect={onSelect} // Function will trigger on select event
                                    onRemove={onRemove} // Function will trigger on remove event
                                    displayValue="name" // Property name to display in the dropdown options
                                />
                                <Form.Text className="text-muted">
                                    Optional
                                </Form.Text>
                            </Form.Group>
                        </Row>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <DropdownButton id="dropdown-basic-button" title="Priority">
                                <Dropdown.Item onClick={() => setTaskPriority("3")}>3 (Highest priority)</Dropdown.Item>
                                <Dropdown.Item onClick={() => setTaskPriority("2")}>2</Dropdown.Item>
                                <Dropdown.Item onClick={() => setTaskPriority("1")}>1 (Lowest priority)</Dropdown.Item>
                            </DropdownButton>
                            <Form.Text className="text-muted">
                                Optional
                            </Form.Text>

                        </Form.Group>

                    </Form>


                </Modal.Body>
                <Modal.Footer
                    style={{
                        backgroundColor: '#f8f9fa',
                        borderTop: '1px solid #e9ecef',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                    >
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <form onSubmit={handleSubmit}>

            </form>
        </>
    )
}