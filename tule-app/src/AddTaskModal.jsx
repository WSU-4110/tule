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

export function AddTaskModal(props) {
    const [taskName, setTaskName] = useState('');
    const [taskDuration, setTaskDuration] = useState('');
    const [taskDurationHours, setTaskDurationHours] = useState(0);
    const [taskDurationMinutes, setTaskDurationMinutes] = useState(0);
    const [taskBreakDurationBool, setTaskBreakDurationBool] = useState(false);
    const [taskBreakDuration, setTaskBreakDuration] = useState('');
    const [taskBreakDurationHours, setTaskBreakDurationHours] = useState(0);
    const [taskBreakDurationMinutes, setTaskBreakDurationMinutes] = useState(0);
    const [taskDateBool, setTaskDateBool] = useState(false);
    const [taskDate, setTaskDate] = useState('');
    const [taskStartTimeBool, setTaskStartTimeBool] = useState(false);
    const [taskStartTime, setTaskStartTime] = useState('');
    const [taskPriority, setTaskPriority] = useState('');
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
            id: props.id,
            taskName: taskName,
            startTime: taskStartTime,
            duration: taskDurationHours + ":" + taskDurationMinutes,
            break: taskBreakDurationHours + ":" + taskBreakDurationMinutes,
            date: taskDate,
            days: reccuringDays,
            priority: taskPriority
        }
        props.resetModal(false);
        props.update([...props.currentTasks, newTask])
        console.log(props.currentTasks);
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
                            <Form.Group as={Col} controlId="formBasicEmail">
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
                                controlId="formBasicPassword"
                                disabled={!taskStartTimeBool}
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

                            <Form.Group as={Col} controlId="formBasicPassword">
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

                    {/* <label style={{marginRight: '20px'}} htmlFor="taskName">Task Name</label>
                    <input value={taskName} onChange={(u) => setTaskName(u.target.value)} type="username"></input>
                    <br></br>
                    <label style={{marginRight: '20px'}} htmlFor="password">Password</label>
                    <input value={taskStartTime} onChange={(p) => setTaskStartTime(p.target.value)} type="password" placeholder="********"></input>
                    <br></br>
                    <label style={{marginRight: '20px'}} htmlFor="password">Confirm password</label>
                    <input value={taskDuration} onChange={(p) => setTaskDuration(p.target.value)} type="password" placeholder="********"></input>
                    <br></br>
                    <input type={"checkbox"} value={terms} onChange={(t) => setTerms(!terms)}></input>
                    <label style={{marginRight: '20px'}} htmlFor="terms">I agree to the terms and conditions</label>
                    <br></br> */}



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