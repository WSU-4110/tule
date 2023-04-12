import React, {useState} from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Multiselect from 'multiselect-react-dropdown';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { EditTaskModal } from "./EditTaskModal";
import { AddTaskModal } from "./AddTaskModal";

export function ScheduleModal(props) {
    const [show, setShow] = useState(true);
    const daysOfWeek = [
        { name: 'Sunday', id: 0 },
        { name: 'Monday', id: 1 },
        { name: 'Tuesday', id: 2 },
        { name: 'Wednesday', id: 3 },
        { name: 'Thursday', id: 4 },
        { name: 'Friday', id: 5 },
        { name: 'Saturday', id: 6 },
      ];
    const [activeDays, setActiveDays] = useState([]);
    const [activeStart, setActiveStart] = useState('');
    const [activeEnd, setActiveEnd] = useState('');
    const [taskList, setTaskList] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [timeInverified, setTimeinVerified] = useState(false);
    const [taskSelected, setTaskSelected] = useState(false);

    const onSelect = (selectedItem) => {
        activeDays.push(selectedItem);
    }
    const onRemove = (removedItem) => {
        activeDays.splice(activeDays.indexOf(removedItem), 1);
    }
    
    const handleSubmit = (event) => {
        props.resetModal();
        event.preventDefault();
        if (verifyTimes()) {
            console.log(activeDays[0]);
            console.log(activeStart);
            console.log(activeEnd);
            console.log(Array.from({length:(parseInt(activeEnd.split(":")[0])-parseInt(activeStart.split(":")[0])+ 1)}, (_,i) => parseInt(activeStart.split(":")[0])+i));
            props.setActiveHours(Array.from({length:(parseInt(activeEnd.split(":")[0])-parseInt(activeStart.split(":")[0])+ 1)}, (_,i) => parseInt(activeStart.split(":")[0])+i))
            setShow(false);
        }
    }

    const handleCancel = (event) => {
        event.preventDefault();
        props.resetModal();
    }

    // Supposed to call the backend and regenerate the schedule.
    const handleRegen = (event) => {
        event.preventDefault();
        props.regenerateSchedule();
    }

    function verifyTimes() {
        const startHours = parseInt(activeStart[0] + activeStart[1]);
        const endHours = parseInt(activeEnd[0] + activeEnd[1]);
        const startMinutes = parseInt(activeStart[3] + activeStart[4]);
        const endMinutes = parseInt(activeEnd[3] + activeEnd[4]);
        if (startHours > endHours) {
            setTimeinVerified(true);
            setErrorMessage('Start time must be before end time');
            return false;
        } else if (startHours === endHours){
            if (startMinutes > endMinutes) {
                setTimeinVerified(true);
                setErrorMessage('Start time must be before end time');
                return false;
            } else if (startMinutes === endMinutes) {
                setTimeinVerified(true);
                setErrorMessage('Start time must be before end time');
                return false;
            }
        }
        return true;
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
                    <Modal.Title>Edit Schedule</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Form.Group as={Col} controlId="ActiveStart">
                                <Form.Label>Schedule Start Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    value={activeStart}
                                    isInvalid={timeInverified}
                                    onChange={(e) => setActiveStart(e.target.value)}
                                    style={{
                                        border: "none",
                                        borderBottom: "1px solid #007bff",
                                        borderRadius: "0px",
                                        outline: "none",
                                        boxShadow: "none",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        color: "#007bff",
                                    }}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errorMessage}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} controlId="ActiveEnd">
                                <Form.Label>Schedule End Time</Form.Label>
                                <Form.Control
                                type="time"
                                    value={activeEnd}
                                    isInvalid={timeInverified}
                                    onChange={(e) => setActiveEnd(e.target.value)}
                                    style={{
                                        border: "none",
                                        borderBottom: "1px solid #007bff",
                                        borderRadius: "0px",
                                        outline: "none",
                                        boxShadow: "none",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        color: "#007bff",
                                    }}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errorMessage}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <br></br>
                        <Row>
                            <Form.Group as={Col} controlId="ActiveDays">
                                <Form.Label>Active Days</Form.Label>
                                <Multiselect
                                    options={daysOfWeek} // Options to display in the dropdown
                                    onSelect={onSelect} // Function will trigger on select event
                                    onRemove={onRemove} // Function will trigger on remove event
                                    displayValue="name" // Property name to display in the dropdown options
                                    placeholder="Select Days"
                                />
                            </Form.Group>
                        </Row>
                        <br></br>
                        <Row>
                            <Form.Group as={Col} controlId="Regenerate">
                                <Button variant="primary" type="submit" onClick={handleRegen}>
                                    Regenerate Schedule
                                </Button>
                            </Form.Group>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.resetModal}>
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