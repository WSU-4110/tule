import React, { useState } from "react"
import Alert from 'react-bootstrap/Alert';
import Navbar from "./components/Navbar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";


export const SignUp = (props) => {
    const [username, setUsername] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [terms, setTerms] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [verifiedUsername, setVerifiedUsername] = useState('false');
    const [verifiedPassword, setVerifiedPassword] = useState('false');

    // Handles form submission.
    // Checks if all conditions are met.
    const handleSubmit = (e) => {
        e.preventDefault();

    }

    // Checks if all conditions are met.
    const checkConditions = (password) => {
        if (terms) {
            if (checkForSpecialCharacters()) {
                if (checkPasswordsMatch()) {
                    if (checkPasswordLength()) {
                        setVerifiedUsername('true');
                        setVerifiedPassword('true');
                        console.log(username);
                        console.log(password1);
                    } else {
                        setErrorMessage('Password is too short');
                        setShowAlert(true);
                        setVerifiedPassword('Password is too short');
                    }
                } else {
                    setErrorMessage('Passwords do not match');
                    setShowAlert(true);
                    setVerifiedPassword('Passwords do not match');
                }
            } else {
                setErrorMessage('Username or password contains'
                    + ' forbidden character(s)');
                setShowAlert(true);
                setVerifiedPassword('Username or password contains'
                    + ' forbidden character(s)');
            }
        } else {
            setErrorMessage('You must agree to the terms and conditions');
            setShowAlert(true);
            setVerifiedPassword('You must agree to the terms and conditions');
        }

    }

    // Checks if passwords match.
    function checkPasswordsMatch() {
        if (password1 !== password2) {
            return false;
        }
        return true;
    }

    // Checks if password is longer than 7 characters.
    function checkPasswordLength() {
        if (password1.length > 7) {
            return true;
        }
        return false;
    }

    // Checks if password or username conatin special characters.
    function checkForSpecialCharacters() {
        const specialCharacters = ['!', '@', '#', '$', '%', '^', '&', '*',
            '(', ')', '-', '_', '+', '=', '{', '}', '[', ']', '|', ':', ';',
            '"', '<', '>', '?', '/', '~', '`', '.'];
        for (let i = 0; i < specialCharacters.length; i++) {
            if (username.includes(specialCharacters[i])) {
                return false;
            }
            if (password1.includes(specialCharacters[i])) {
                return false;
            }
        }
        return true;
    }
    
    return(
        <div>
            <Navbar text="Tule"/>
            <div
            style={{
                width: '30%',
                margin: 'auto',
            }}
            centered>
                <Form>
                    {showAlert && (
                        <Alert
                        variant="danger"
                        onClose={() => setShowAlert(false)}
                        style={{height: '90px'}}
                        dismissible>
                            <Alert.Heading>Sign Up Error</Alert.Heading>
                                <p> {errorMessage} </p>
                        </Alert>
                    )}
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="username" placeholder="Username" value={username} onChange={(u) => setUsername(u.target.value)}/>
                    </Form.Group>
                    <br></br>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password1} onChange={(p) => setPassword1(p.target.value)}/>
                    </Form.Group>
                    <br></br>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password2} onChange={(p) => setPassword2(p.target.value)}/>
                    </Form.Group>
                    <br></br>
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check
                        type="checkbox"
                        label="I agree to the terms and conditions"
                        value={terms}
                        onChange={(t) => setTerms(!terms)}
                        style={{width: '280px'}}
                        />
                    </Form.Group>
                    <br></br>
                    <Button variant="primary" type="submit" onClick={handleSubmit}>
                        Sign Up
                    </Button>
                </Form>
            </div>
        </div>
    )
}


//             {/* <Form.Group as={Row} controlId="formHorizontalEmail">
//                 <Form.Label column sm={2}>
//                     Username
//                 </Form.Label>
//                 <Col sm={10}>
//                     <Form.Control type="username" placeholder="Username" value={username} onChange={(u) => setUsername(u.target.value)}/>
//                 </Col>
//             </Form.Group>
                
//             <Form.Group as={Row} controlId="formHorizontalPassword">
//                 <Form.Label column sm={2}>
//                     Password
//                 </Form.Label>
//                 <Col sm={10}>
//                     <Form.Control type="password" placeholder="Password" value={password1} onChange={(p) => setPassword1(p.target.value)}/>
//                 </Col>
//             </Form.Group>
//             <Form.Group as={Row} controlId="formHorizontalPassword">
//                 <Form.Label column sm={2}>
//                     Confirm Password
//                 </Form.Label>
//                 <Col sm={10}>
//                     <Form.Control type="password" placeholder="Password" value={password2} onChange={(p) => setPassword2(p.target.value)}/>
//                 </Col>
//             </Form.Group>
//             <Form.Group as={Row}>
//                 <Col sm={{ span: 10, offset: 2 }}>
//                     <Form.Check label="I agree to the terms and conditions" value={terms} onChange={(t) => setTerms(!terms)}/>
//                 </Col>
//             </Form.Group>
//             <Form.Group as={Row}>
//                 <Col sm={{ span: 10, offset: 2 }}>
//                     <Button type="submit" onClick={handleSubmit}>Sign Up</Button>
//                 </Col>
//             </Form.Group>
//         </Form>
//          */}
//         // <form onSubmit={handleSubmit}>
//         //     <Navbar text="Tule"/>
//         //     {showAlert && (
//         //         <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
//         //             <Alert.Heading>Sign Up Error</Alert.Heading>
//         //                 <p> {errorMessage} </p>
//         //         </Alert>
//         //     )}
//         //     {/* <br></br>
//         //     <h1>Sign Up Page</h1>
//         //     <label style={{marginRight: '20px'}} htmlFor="username">Username</label>
//         //     <input value={username} onChange={(u) => setUsername(u.target.value)} type="username" placeholder="Username"></input>
//         //     <br></br>
//         //     <label style={{marginRight: '20px'}} htmlFor="password">Password</label>
//         //     <input value={password1} onChange={(p) => setPassword1(p.target.value)} type="password" placeholder="********"></input>
//         //     <br></br>
//         //     <label style={{marginRight: '20px'}} htmlFor="password">Confirm password</label>
//         //     <input value={password2} onChange={(p) => setPassword2(p.target.value)} type="password" placeholder="********"></input>
//         //     <br></br>
//         //     <input type={"checkbox"} value={terms} onChange={(t) => setTerms(!terms)}></input>
//         //     <label style={{marginRight: '20px'}} htmlFor="terms">I agree to the terms and conditions</label>
//         //     <br></br>
//         //     <button type="submit">Submit</button>
//         //     <button onClick={() => props.onChangeScreen('login')}>Login instead</button> */}
//         // </form>
//     )
// }