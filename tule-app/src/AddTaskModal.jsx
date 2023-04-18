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

async function saveTask(task){
    try{
        const response = await fetch('http://localhost:3001/SaveTask',{
            method:'POST',
            mode:'cors',
            headers:{
                'Access-Control-Allow-Origin':'http://localhost:3000',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                "Username":sessionStorage['Username'],
                "Password":sessionStorage['Password'],
                "Task":task
            })
        })
        return await response;
    }
    catch(err){
        console.log(err);
        return false;
    }
}
export function AddTaskModal(props) {
    const [taskName, setTaskName] = useState('');
    const [taskDuration, setTaskDuration] = useState('');
    const [taskDurationHours, setTaskDurationHours] = useState(0);
    const [taskDurationMinutes, setTaskDurationMinutes] = useState(0);
    const [taskBreakDuration, setTaskBreakDuration] = useState('');
    const [taskBreakDurationHours, setTaskBreakDurationHours] = useState(0);
    const [taskBreakDurationMinutes, setTaskBreakDurationMinutes] = useState(0);
    const [taskDate, setTaskDate] = useState('');
    const [taskStartTime, setTaskStartTime] = useState('');
    const [taskPriority, setTaskPriority] = useState("None");
    const [reccuringDays, setReccuringDays] = useState([]);
    const [showModal, setShowModal] = useState(true);
    const [taskLocation, setTaskLocation] = useState("-----");
    const [addLocation, setAddLocation] = useState(false);
    const [locations, setLocations] = useState([]);
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

    // Makes a list of all unique locations in the current tasks list
    // to be used in the location dropdown menu.
    const locationsList = () => {
        for (var i = 0; i < props.currentTasks.length; i++) {
            if (props.currentTasks[i].Location !== ''
                && props.currentTasks[i].Location !== undefined) {
                    try{
                        if(!locations.includes(props.currentTasks[i].Location)){
                            locations.push(props.currentTasks[i].Location);
                        }
                    } catch(err){
                        console.log(err);
                        locations = [props.currentTasks[i].Location];
                    }
            }
        }
        return locations;
    }

    const addNewLocation = () => {
        setAddLocation(true);
        setTaskLocation("Add new location");
    }

    const changeLocation = (location) => {
        setTaskLocation(location);
        setAddLocation(false);
    }

    const handleClose = () => {
        setShowModal(false);
        console.log(taskStartTime);
        props.resetModal(false);
    }

    const handleShow = () => {
        setShowModal(true)
        props.resetModal(true);
    }

    const onSelect = (selectedItem) => {
        try {
            reccuringDays.push(selectedItem);
        } catch (err) {
            console.log(err);
            reccuringDays = [selectedItem];
        }
    }

    const onRemove = (selectedItem) => {
        try {
            reccuringDays.pop(selectedItem);
        } catch (err) {
            console.log(err);
            reccuringDays = [];
        }
    }

    // Handles form submission.
    // Checks if all conditions are met.
    const handleSubmit = (e) => {
        e.preventDefault();

        if (taskBreakDurationHours < 10) {
            setTaskBreakDurationHours('0' + taskBreakDurationHours.toString());
        } else {
            setTaskBreakDurationHours(taskBreakDurationHours.toString());
        }
        if (taskBreakDurationMinutes < 10) {
            setTaskBreakDurationMinutes('0' + taskBreakDurationMinutes.toString());
        } else {
            setTaskBreakDurationMinutes(taskBreakDurationMinutes.toString());
        }
        if (taskDurationHours < 10) {
            setTaskDurationHours('0' + taskDurationHours.toString());
        } else {
            setTaskDurationHours(taskDurationHours.toString());
        }
        if (taskDurationMinutes < 10) {
            setTaskDurationMinutes('0' + taskDurationMinutes.toString());
        } else {
            setTaskDurationMinutes(taskDurationMinutes.toString());
        }
        setTaskBreakDuration(taskBreakDurationHours + ':' + taskBreakDurationMinutes);
        setTaskDuration(taskDurationHours + ':' + taskDurationMinutes);

        if (taskPriority === 'None') {
            setTaskPriority(0);
        }

        if (taskName !== '') {
            if (taskDuration !== '') {
                if (taskDate !== '') {
                    if (taskPriority === '') {
                        setTaskPriority(0)
                    }
                    setShowModal(false);
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
        console.log(taskDate);
        console.log(taskLocation);
        let tempDate = new Date(taskDate);
        let inputDate = new Date(tempDate.getTime() + tempDate.getTimezoneOffset()*60000);
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
                Time: inputDate}
                ,
            Reccurence: reccuringDays,
            Priority: parseInt(taskPriority),
            Location: taskLocation,
            Complete: false
        }
        console.log(newTask);
        saveTask(newTask);
        props.resetModal(false);
        props.update([...props.currentTasks, newTask])
        //console.log(props.currentTasks);
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
                show={showModal}
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
                    <Modal.Title>Add Task</Modal.Title>
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
                            <Form.Group as={Col} controlId="formTaskName">
                                <Form.Label>Task Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter task name"
                                    onChange={(u) => setTaskName(u.target.value)}
                                    autoFocus
                                    />
                            </Form.Group>

                            <Form.Group
                                as={Col}
                                controlId="formStartTime"
                                >
                                <Form.Label>Start Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    value={taskStartTime}
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
                                        type='number'
                                        min='0'
                                        max='24'
                                        value={taskDurationHours}
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
                                            type='number'
                                            min='0'
                                            max='60'
                                            value={taskDurationMinutes}
                                            onChange={(u) => setTaskDurationMinutes(u.target.value)}
                                            />
                                        <Form.Text muted>
                                            Minutes
                                        </Form.Text>
                                    </Col>
                                </Row>

                                {/* <Stack direction='horizontal' gap={3}>
                                    <Form.Group controlId='formBasicCheckbox'>
                                        <Form.Control type='number' min='0' max='24' value={taskDuration} onChange={(u) => setTaskDurationHours(u.target.value)} required />
                                        <Form.Text muted>
                                            Hours
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Control plaintext readOnly defaultValue=":" />
                                    
                                    <Form.Group controlId='formBasicCheckbox'>
                                        <Form.Control type='number' min='0' max='60' value={taskDuration} onChange={(u) => setTaskDurationMinutes(u.target.value)} required />
                                        <Form.Text muted>
                                            Minutes
                                        </Form.Text>
                                    </Form.Group>
                                </Stack> */}

                                {/* <Row className="duration">
                                    <Col sm={5} >
                                    <Form.Control type='number' min='0' max='24' value={taskDuration} onChange={(u) => setTaskDurationHours(u.target.value)} required />
                                    <Form.Text muted>
                                        Hours
                                    </Form.Text>
                                    </Col>

                                    <Col xs={1} sm={1} lg={1} >
                                    <Form.Label>:</Form.Label>
                                    </Col>

                                    <Col sm={5} >
                                    <Form.Control type='number' min='0' max='60' value={taskDuration} onChange={(u) => setTaskDurationMinutes(u.target.value)} required />
                                    <Form.Text muted>
                                        Minutes
                                    </Form.Text>
                                    </Col>
                                </Row> */}
                            </Form.Group>

                            <Form.Group as={Col} controlId="formBreakDuration">
                                <Form.Label>Break Duration</Form.Label>
                                <Row className="break duration">
                                    <Col sm={5} >
                                    <Form.Control
                                    type='number'
                                    min='0'
                                    max='24'
                                    value={taskBreakDurationHours}
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
                                        value={taskBreakDurationMinutes}
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
                            <Form.Group as={Col} controlId="formDate">
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    onChange={(u) => setTaskDate(u.target.value)}
                                    />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formRecurringDays">
                                <Form.Label>Reccuring Days</Form.Label>
                                <Multiselect
                                    options={daysOfWeek}
                                    selectedValues={reccuringDays}
                                    onSelect={onSelect}
                                    onRemove={onRemove}
                                    displayValue="name"
                                />
                                <Form.Text className="text-muted">
                                    Optional
                                </Form.Text>
                            </Form.Group>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formTaskLocation">
                                    <Form.Label>Location</Form.Label>
                                    <DropdownButton
                                        id="dropdown-basic-button"
                                        title={taskLocation}>
                                            <ul>
                                                {(locationsList() !== undefined) && locations && locations.map && locations.map((location) => (
                                                    <Dropdown.Item onClick={() => changeLocation(location)}>{location}</Dropdown.Item>
                                                ))}
                                            </ul>
                                            <Dropdown.Item onClick={() => addNewLocation()}>
                                                Add new location
                                            </Dropdown.Item>
                                    </DropdownButton>
                                    <Form.Text className="text-muted">
                                        Optional
                                    </Form.Text>
                                </Form.Group>
                            </Col>

                            <Col>
                                {(addLocation) && (
                                    <Form.Group className="mb-3" controlId="formTaskLocation">
                                        <Form.Label>Add Location</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter location"
                                            onChange={(u) => setTaskLocation(u.target.value)}
                                            />
                                    </Form.Group>
                                )}
                                {!((taskLocation === "-----") || (taskLocation === "Add new location"))
                                    && (!addLocation) && (
                                    <Form.Group className="mb-3" controlId="formTaskLocationDisplay">
                                        <Form.Label>Selected Location</Form.Label>
                                        {(taskLocation === "-----") && (
                                            <Form.Control type="text" value="" readOnly/>
                                        )}

                                        {(taskLocation !== "-----") && (
                                            <Form.Control type="text" value={taskLocation} readOnly/>
                                        )}
                                    </Form.Group>
                                )}
                            </Col>
                        </Row>

                        <Row>
                            <Form.Group className="mb-3" controlId="formTaskPriority">
                                <Form.Label>Priority</Form.Label>
                                <DropdownButton
                                    id="dropdown-basic-button"
                                    title={taskPriority}>
                                    <Dropdown.Item onClick={() => setTaskPriority("3")}>
                                        3 (Highest Priority)
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => setTaskPriority("2")}>
                                        2
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => setTaskPriority("1")}>
                                        1 (Lowest Priority)
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => setTaskPriority("None")}>
                                        0 (No Priority)
                                    </Dropdown.Item>
                                </DropdownButton>
                                <Form.Text className="text-muted">
                                    Optional
                                </Form.Text>
                            </Form.Group>
                        </Row>
                        
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