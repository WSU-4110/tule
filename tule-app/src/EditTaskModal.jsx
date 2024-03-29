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

// This function is used to save the updated task to the database.
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

export function EditTaskModal(props) {
    const [showModal, setShowModal] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    var taskIDConst = "Task ID";
    var taskNameConst = "Task Name";
    var taskDurationConst = "Task Duration";
    var taskBreakDurationConst = "Task Break Duration";
    var taskDateConst = "Task Date";
    var taskStartTimeConst = "Task Start Time";
    var taskLocationConst = "Task Location";
    var taskPriorityConst = "Task Priority";
    var taskBreakDurationHoursConst = 0;
    var taskBreakDurationMinutesConst = 0;
    var taskDurationHoursConst = 0;
    var taskDurationMinutesConst = 0;
    var reccuringDaysConst = [];
    var addLocation = false;
    const locations = new Array();

    const daysOfWeek = [
          { name: 'Sunday', id: 0 },
          { name: 'Monday', id: 1 },
          { name: 'Tuesday', id: 2 },
          { name: 'Wednesday', id: 3 },
          { name: 'Thursday', id: 4 },
          { name: 'Friday', id: 5 },
          { name: 'Saturday', id: 6 },
    ];

    try {
        const task = props.task;
        console.log(props.task._id);
        console.log(task);
        console.log(task.Name);
        console.log(task.Duration);
        console.log(task.Date.Time);

        taskIDConst = task._id;
        taskNameConst = task.Name;
        taskDurationConst = task.Duration;
        taskBreakDurationConst = task.Break.Time;
        taskDateConst = task.Date.Time.slice(0, 10);
        taskStartTimeConst = task.StartTime.Time;
        taskLocationConst = task.Location;
        taskPriorityConst = task.Priority;
        reccuringDaysConst = task.Reccurence[0];
        taskBreakDurationHoursConst = parseInt((((task.Break.Time).toString()).split(".")).slice(0));
        taskBreakDurationMinutesConst = parseFloat("0." + (((task.Break.Time).toString()).split(".")).slice(1)) * 60;
        taskDurationHoursConst = parseInt((((task.Duration).toString()).split(".")).slice(0));
        taskDurationMinutesConst = parseFloat("0." + (((task.Duration).toString()).split(".")).slice(1)) * 60;

        console.log(reccuringDaysConst);
        console.log(taskDateConst);

        if (taskPriorityConst === 0) {
            taskPriorityConst = "None";
        } else if ((taskPriorityConst === null) || (taskPriorityConst === undefined)) {
            taskPriorityConst = "None";
        }

        
    } catch (err) {
        console.log(err);
    }

    // Makes a list of all unique locations in the current tasks list
    // to be used in the location dropdown menu.
    const locationsList = () => {
        for (var i = 0; i < props.currentTasks.length; i++) {
            if (props.currentTasks[i].Location !== ''
                && props.currentTasks[i].Location !== undefined) {
                    try{
                        if (!locations.includes(props.currentTasks[i].Location)) {
                            locations.push(props.currentTasks[i].Location);
                        }
                    } catch(err){
                        console.log(err);
                        locations = [props.currentTasks[i].Location];
                    }
            }
        }
        locations.pop('-----');
        return locations;
    }

    const addNewLocation = () => {
        addLocation = (true);
        taskLocationConst = ("Add new location");
    }

    const changeLocation = (location) => {
        taskLocationConst = (location);
        addLocation = (false);
    }

    const noLocation = () => {
        taskLocationConst = ("-----");
        addLocation = (false);
    }

    const handleClose = () => {
        setShowModal(false);
        console.log(taskStartTimeConst);
        props.resetModal(false);
    }

    const handleShow = () => {
        setShowModal(true);
        props.resetModal(true);
    }

    const onSelect = (selectedItem) => {
        reccuringDaysConst.push(selectedItem);
    }

    const onRemove = (selectedItem) => {
        reccuringDaysConst.pop(selectedItem);
    }

    // Handles form submission.
    // Checks if all conditions are met.
    const handleSubmit = (e) => {
        e.preventDefault();
        locations.pop('-----');

        if (taskDurationHoursConst < 10) {
            taskDurationHoursConst = ('0' + taskDurationHoursConst);
        }
        if (taskDurationMinutesConst < 10) {
            taskDurationMinutesConst = ('0' + taskDurationMinutesConst);
        }
        if (taskBreakDurationHoursConst < 10) {
            taskBreakDurationHoursConst = ('0' + taskBreakDurationHoursConst);
        }
        if (taskBreakDurationMinutesConst < 10) {
            taskBreakDurationMinutesConst = ('0' + taskBreakDurationMinutesConst);
        }
        taskDurationConst = (taskDurationHoursConst + ':' + taskDurationMinutesConst);
        taskBreakDurationConst = (taskBreakDurationHoursConst + ':' + taskBreakDurationMinutesConst);

        if ((taskPriorityConst !== 3) && (taskPriorityConst !== 2) && (taskPriorityConst !== 1)) {
            taskPriorityConst = 0;
        }

        if (taskNameConst !== '') {
            if (taskDurationConst !== '') {
                if (taskDateConst !== '') {
                    if (taskPriorityConst === 'None') {
                        taskPriorityConst = 0;
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
        console.log(taskNameConst);
        console.log(taskDurationConst);
        console.log(taskDurationHoursConst + ":" + taskDurationMinutesConst);
        const newTask = {
            _id: taskIDConst,
            Name: taskNameConst,
            StartTime: {
                Active: taskStartTimeConst != "",
                Time: taskStartTimeConst}
                ,
            Duration: parseFloat(taskDurationHoursConst) + parseFloat(taskDurationMinutesConst)/60,
            Break: {
                Active: taskBreakDurationConst!= 0 && taskBreakDurationConst!=0,
                Time: parseFloat(taskBreakDurationHoursConst) + parseFloat(taskBreakDurationMinutesConst)/60
            },
            Date: {
                Active: taskDateConst != "", 
                Time: new Date(taskDateConst)}
                ,
            Reccurence: reccuringDaysConst,
            Priority: parseInt(taskPriorityConst),
            Location: taskLocationConst,
            Complete: false
        }
        console.log(newTask);
        saveTask(newTask);
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
                                    defaultValue = {taskNameConst}
                                    type="text"
                                    data-testid="taskName"
                                    placeholder="Enter task name"
                                    onChange={(u) => (taskNameConst = u.target.value)}
                                    autoFocus
                                    />
                            </Form.Group>

                            <Form.Group
                                as={Col}
                                controlId="formBasicPassword"
                                >
                                <Form.Label>Start Time</Form.Label>
                                <Form.Control
                                    defaultValue = {taskStartTimeConst}
                                    type="time"
                                    data-testid="taskStartTime"
                                    onChange={(u) => (taskStartTimeConst = u.target.value)}
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
                                        defaultValue = {taskDurationHoursConst}
                                        type='number'
                                        data-testid="taskDurationHours"
                                        min='0'
                                        max='24'
                                        onChange={(u) => (taskDurationHoursConst = u.target.value)}
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
                                            defaultValue = {taskDurationMinutesConst}
                                            type='number'
                                            data-testid="taskDurationMinutes"
                                            min='0'
                                            max='60'
                                            onChange={(u) => (taskDurationMinutesConst = u.target.value)}
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
                                    defaultValue = {taskBreakDurationHoursConst}
                                    type='number'
                                    data-testid="taskBreakDurationHours"
                                    min='0'
                                    max='24'
                                    onChange={(u) => (taskBreakDurationHoursConst = u.target.value)}
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
                                        defaultValue = {taskBreakDurationMinutesConst}
                                        type='number'
                                        data-testid="taskBreakDurationMinutes"
                                        min='0'
                                        max='60'
                                        onChange={(u) => (taskBreakDurationMinutesConst = u.target.value)}
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
                            <Form.Group as={Col} controlId="formTaskDate">
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    defaultValue = {taskDateConst}
                                    type="date"
                                    data-testid="taskDate"
                                    onChange={(u) => (taskDateConst = u.target.value)}
                                    />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formRecurringDays">
                                <Form.Label>Reccuring Days</Form.Label>
                                <Multiselect
                                    options={daysOfWeek} 
                                    selectedValues={reccuringDaysConst} 
                                    onSelect={onSelect} 
                                    onRemove={onRemove} 
                                    displayValue="name"
                                    placeholder="Select Days"
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
                                        data-testid="taskLocation"
                                        title={taskLocationConst}>
                                            <ul>
                                                {(locationsList() !== undefined) && locations && locations.map && locations.map((location) => (
                                                        <Dropdown.Item onClick={() => changeLocation(location)}>{location}</Dropdown.Item>
                                                    ))}
                                            </ul>
                                            <Dropdown.Item onClick={() => addNewLocation()}>
                                                Add new location
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => noLocation()}>
                                                None
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
                                            onChange={(u) => (taskLocationConst = u.target.value)}
                                            />
                                    </Form.Group>
                                )}
                                {!((taskLocationConst === "-----") || (taskLocationConst === "Add new location"))
                                    && (!addLocation) && (
                                    <Form.Group className="mb-3" controlId="formTaskLocationDisplay">
                                        <Form.Label>Selected Location</Form.Label>
                                        {(taskLocationConst === "-----") && (
                                            <Form.Control type="text" value="" readOnly/>
                                        )}

                                        {(taskLocationConst !== "-----") && (
                                            <Form.Control type="text" value={taskLocationConst} readOnly/>
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
                                    data-testid="taskPriority"
                                    title={taskPriorityConst}>
                                    <Dropdown.Item onClick={() => (taskPriorityConst = 3)}>
                                        3 (Highest Priority)
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => (taskPriorityConst = 2)}>
                                        2
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => (taskPriorityConst = 1)}>
                                        1 (Lowest Priority)
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => (taskPriorityConst = "None")}>
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
                    <Button variant="danger" onClick={handleClose}>
                        Delete Task
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}