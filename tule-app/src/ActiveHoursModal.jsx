import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ModalBody } from 'reactstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

export function ActiveHoursModal(props) {

    const [show, setShow] = useState(true);
    const [start, setStart] = useState(props.activeHours[0]);
    const [end, setEnd] = useState(props.activeHours[props.activeHours.length - 1]);
    const handleSubmit = (e) => {
        e.preventDefault();
        if(end-start >1){
            props.setActiveHours(Array.from({length:(end-start+ 1)}, (_,i) => start+i))
            props.resetModal();
        }
        else{

        }
        
    }
    const handleClose = () => {
        setShow(false);
        props.resetModal();
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
                    <Modal.Title>Set Active Hours</Modal.Title>
                </Modal.Header>
                <ModalBody>
                        <div className='dayDisplay'>
                            <h2>Start</h2>
                            <DropdownButton id="dropdown-basic-button" title={start}>
                                <Dropdown.Item onClick={() => setStart(0)}>12am</Dropdown.Item>
                                <Dropdown.Item onClick={() => setStart(1)}>1am</Dropdown.Item>
                                <Dropdown.Item onClick={() => setStart(2)}>2am</Dropdown.Item>
                                <Dropdown.Item onClick={() => setStart(3)}>3am</Dropdown.Item>
                                <Dropdown.Item onClick={() => setStart(4)}>4am</Dropdown.Item>
                                <Dropdown.Item onClick={() => setStart(5)}>5am</Dropdown.Item>
                                <Dropdown.Item onClick={() => setStart(6)}>6am</Dropdown.Item>
                                <Dropdown.Item onClick={() => setStart(7)}>7am</Dropdown.Item>
                                <Dropdown.Item onClick={() => setStart(8)}>8am</Dropdown.Item>
                                <Dropdown.Item onClick={() => setStart(9)}>9am</Dropdown.Item>
                                <Dropdown.Item onClick={() => setStart(10)}>10am</Dropdown.Item>
                                <Dropdown.Item onClick={() => setStart(11)}>11am</Dropdown.Item>
                                <Dropdown.Item onClick={() => setStart(12)}>12pm</Dropdown.Item>
                                <Dropdown.Item onClick={() => setStart(13)}>1pm</Dropdown.Item>
                                <Dropdown.Item onClick={() => setStart(14)}>2pm</Dropdown.Item>
                                <Dropdown.Item onClick={() => setStart(15)}>3pm</Dropdown.Item>
                                <Dropdown.Item onClick={() => setStart(16)}>4pm</Dropdown.Item>
                                <Dropdown.Item onClick={() => setStart(17)}>5pm</Dropdown.Item>
                                <Dropdown.Item onClick={() => setStart(18)}>6pam</Dropdown.Item>
                                <Dropdown.Item onClick={() => setStart(19)}>7pm</Dropdown.Item>
                                <Dropdown.Item onClick={() => setStart(20)}>8pm</Dropdown.Item>
                                <Dropdown.Item onClick={() => setStart(21)}>9pm</Dropdown.Item>
                                <Dropdown.Item onClick={() => setStart(22)}>10pm</Dropdown.Item>
                                <Dropdown.Item onClick={() => setStart(23)}>11pm</Dropdown.Item>
                            </DropdownButton>
                        </div>
                        <div className='dayDisplay'>
                            <h2>End</h2>
                            <DropdownButton id="dropdown-basic-button" title={end}>
                                <Dropdown.Item onClick={() => setEnd(0)}>12am</Dropdown.Item>
                                <Dropdown.Item onClick={() => setEnd(1)}>1am</Dropdown.Item>
                                <Dropdown.Item onClick={() => setEnd(2)}>2am</Dropdown.Item>
                                <Dropdown.Item onClick={() => setEnd(3)}>3am</Dropdown.Item>
                                <Dropdown.Item onClick={() => setEnd(4)}>4am</Dropdown.Item>
                                <Dropdown.Item onClick={() => setEnd(5)}>5am</Dropdown.Item>
                                <Dropdown.Item onClick={() => setEnd(6)}>6am</Dropdown.Item>
                                <Dropdown.Item onClick={() => setEnd(7)}>7am</Dropdown.Item>
                                <Dropdown.Item onClick={() => setEnd(8)}>8am</Dropdown.Item>
                                <Dropdown.Item onClick={() => setEnd(9)}>9am</Dropdown.Item>
                                <Dropdown.Item onClick={() => setEnd(10)}>10am</Dropdown.Item>
                                <Dropdown.Item onClick={() => setEnd(11)}>11am</Dropdown.Item>
                                <Dropdown.Item onClick={() => setEnd(12)}>12pm</Dropdown.Item>
                                <Dropdown.Item onClick={() => setEnd(13)}>1pm</Dropdown.Item>
                                <Dropdown.Item onClick={() => setEnd(14)}>2pm</Dropdown.Item>
                                <Dropdown.Item onClick={() => setEnd(15)}>3pm</Dropdown.Item>
                                <Dropdown.Item onClick={() => setEnd(16)}>4pm</Dropdown.Item>
                                <Dropdown.Item onClick={() => setEnd(17)}>5pm</Dropdown.Item>
                                <Dropdown.Item onClick={() => setEnd(18)}>6pam</Dropdown.Item>
                                <Dropdown.Item onClick={() => setEnd(19)}>7pm</Dropdown.Item>
                                <Dropdown.Item onClick={() => setEnd(20)}>8pm</Dropdown.Item>
                                <Dropdown.Item onClick={() => setEnd(21)}>9pm</Dropdown.Item>
                                <Dropdown.Item onClick={() => setEnd(22)}>10pm</Dropdown.Item>
                                <Dropdown.Item onClick={() => setEnd(23)}>11pm</Dropdown.Item>
                            </DropdownButton>
                        </div>
                            
                            
                </ModalBody>
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
        </>
    )
}
export default ActiveHoursModal;