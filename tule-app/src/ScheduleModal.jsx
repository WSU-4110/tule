import React, {useState} from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Multiselect from 'multiselect-react-dropdown';
import Form from 'react-bootstrap/Form';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
            //console.log(activeDays[0]);
            //console.log(activeStart);
            //console.log(activeEnd);
            //console.log(Array.from({length:(parseInt(activeEnd.split(":")[0])-parseInt(activeStart.split(":")[0])+ 1)}, (_,i) => parseInt(activeStart.split(":")[0])+i));
            props.setActiveHours(Array.from({length:(parseInt(activeEnd.split(":")[0])-parseInt(activeStart.split(":")[0])+ 1)}, (_,i) => parseInt(activeStart.split(":")[0])+i))
            setShow(false);
            createSched();
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

    async function createSched(){
        try{
            const response = await fetch("http://localhost:3001/CreateSchedule",{
                method:'POST',
                mode:'cors',
                headers:{
                "Access-Control-Allow-Origin":'http://localhost:3000',
                "Content-Type":'application/json' 
                },
                body:JSON.stringify({
                    "Username":sessionStorage["Username"],
                    "Password":sessionStorage["Password"],
                    "Date": props.displayedDay,
                    "SchedStart":activeStart,
                    "SchedEnd": activeEnd
                })
            })
            
            return response.json(); 
        }

        catch(err){
            console.log(err);
        }
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
                    <Modal.Title>{props.title}</Modal.Title>
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
                        <br></br>
                       { /*<Row>
                            {(props.title === "Edit Schedule") &&
                                <Form.Group as={Col} controlId="Regenerate">
                                    <Button variant="primary" type="submit" onClick={handleRegen}>
                                        Regenerate Schedule
                                    </Button>
                                </Form.Group>
                            }
                        </Row>
                        */}
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