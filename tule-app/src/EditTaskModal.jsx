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
    // const [taskName, setTaskName] = useState(props.currentTasks[props.id].taskName);
    // const [taskDuration, setTaskDuration] = useState(props.currentTasks[props.id].duration);
    // const [taskDurationHours, setTaskDurationHours] = useState(props.currentTasks[props.id].duration.split(':')[0]);
    // const [taskDurationMinutes, setTaskDurationMinutes] = useState(props.currentTasks[props.id].duration.split(':')[1]);
    // const [taskBreakDurationBool, setTaskBreakDurationBool] = useState(false);
    // const [taskBreakDuration, setTaskBreakDuration] = useState('');
    // const [taskBreakDurationHours, setTaskBreakDurationHours] = useState(0);
    // const [taskBreakDurationMinutes, setTaskBreakDurationMinutes] = useState(0);
    // const [taskDateBool, setTaskDateBool] = useState(false);
    // const [taskDate, setTaskDate] = useState(props.currentTasks[props.id].date);
    // const [taskStartTimeBool, setTaskStartTimeBool] = useState(false);
    // const [taskStartTime, setTaskStartTime] = useState(props.currentTasks[props.id].startTime);
    // // need to add location from backend
    // const [taskLocation, setTaskLocation] = useState(props.currentTasks[props.id].location);
    // const [taskPriority, setTaskPriority] = useState(props.currentTasks[props.id].priority);

    // // Still does not retreive reccruing days
    // const [taskName, setTaskName] = useState(props.task.Name);
    // const [taskDuration, setTaskDuration] = useState(props.task.Duration);
    // const [taskDurationHours,setTaskDurationHours] = useState(((props.task.Duration*60).toString()).slice(2));
    // const [taskDurationMinutes, setTaskDurationMinutes] = useState(((props.task.Duration*60).toString()).slice(0, 1));
    // const [taskBreakDuration, setTaskBreakDuration] = useState(props.task.Break.Time);
    // const [taskBreakDurationHours, setTaskBreakDurationHours] = useState(((props.task.Break.Time*60).toString()).slice(2));
    // const [taskBreakDurationMinutes, setTaskBreakDurationMinutes] = useState(((props.task.Break.Time*60).toString()).slice(0, 1));
    // const [taskDate, setTaskDate] = useState(props.task.Date.Time);
    // const [taskStartTime, setTaskStartTime] = useState(props.task.StartTime.Time);
    // const [taskLocation, setTaskLocation] = useState(props.task.Location);
    // const [taskPriority, setTaskPriority] = useState(props.task.Priority);
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
    var taskNameConst = "Task Name";
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
        console.log(task);
        console.log(task.Name);
        console.log(task.Duration);
        taskNameConst = task.Name;
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
        setShowModal(true);
        props.resetModal(true);
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

        if (taskDurationHours < 10) {
            setTaskDurationHours('0' + taskDurationHours.toString());
        }
        if (taskDurationMinutes < 10) {
            setTaskDurationMinutes('0' + taskDurationMinutes.toString());
        }
        if (taskBreakDurationHours < 10) {
            setTaskBreakDurationHours('0' + taskBreakDurationHours.toString());
        }
        if (taskBreakDurationMinutes < 10) {
            setTaskBreakDurationMinutes('0' + taskBreakDurationMinutes.toString());
        }
        setTaskDuration(taskDurationHours + ':' + taskDurationMinutes);
        setTaskBreakDuration(taskBreakDurationHours + ':' + taskBreakDurationMinutes);

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
            Location: taskLocation,
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
                                    placeholder="Enter task name"
                                    onChange={(u) => setTaskName(u.target.value)}
                                    autoFocus
                                    />
                            </Form.Group>

                            <Form.Group
                                as={Col}
                                controlId="formBasicPassword"
                                >
                                <Form.Label>Start Time</Form.Label>
                                <Form.Control
                                    defaultValue = {taskStartTime}
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
                                        defaultValue = {taskDurationHours}
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
                                            defaultValue = {taskDurationMinutes}
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
                                    defaultValue = {taskBreakDurationHours}
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
                                        defaultValue = {taskBreakDurationMinutes}
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
                            <Form.Group as={Col} controlId="formTaskDate">
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    defaultValue = {taskDate}
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

            <form onSubmit={handleSubmit}>

            </form>
        </>
    )
}