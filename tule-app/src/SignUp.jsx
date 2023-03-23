import React, { useState } from "react";
import Alert from 'react-bootstrap/Alert';
import Navbar from "./components/Navbar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";

// username and possword1 are variable filled by form

export const SignUp = (props) => {
    const [username, setUsername] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [terms, setTerms] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPassordError] = useState('');
    const [verifiedUsername, setVerifiedUsername] = useState(false);
    const [verifiedPassword, setVerifiedPassword] = useState(false);
    const [verifiedTerms, setVerifiedTerms] = useState(false);

    // Handles form submission.
    // Checks if all conditions are met.
    async function handleSubmit(e) {
        e.preventDefault();
        console.log(username);
        console.log(password1);
        if (!terms) { 
            setVerifiedTerms(true);
        } else {
            setVerifiedTerms(false);
        }
        {/*set pass with fetch here and variables*/}
        var data = {};
        if (checkPassword()){
            try{
                const response = await fetch("http://localhost:3001/AccountCreate",{
                    method:'POST',
                    mode:'cors',
                    headers:{
                    "Access-Control-Allow-Origin":'http://localhost:3000',
                    "Content-Type":'application/json' 
                    },
                    body:JSON.stringify({
                        "Username":username,
                        "Password":password1   
                    })
                })
                data = await response.json();
                console.log(data);
            } catch(err){
                console.log(err);
            }
            console.log(data)
            if (data['AccountCreate'] == "True"){
                props.onChangeScreen('tasks'); 
            }
            else {
                setUsernameError('Username already in use. Select new username.');
                setVerifiedUsername(true);
            }
        }
        else {
            setPassordError('Invalid Password. Please enter a new password.');
            setVerifiedPassword(true);
        }
    }

    // Checks if all conditions are met.
    function checkPassword() {
        if ((checkForSpecialCharacters())
            && (checkForCapitalLetters())
            && (checkForNumbers())
            && (checkForSpaces())
            && (checkPasswordLength())
            && (checkPasswordsMatch())
            && (checkForEmptyString())
            && (terms))
            {
            console.log(username);
            console.log(password1);
            return true
        }
        return false
    }

    // Checks if passwords match.
    function checkPasswordsMatch() {
        if (password1 !== password2) {
            setVerifiedPassword(true);
            return false;
        }
        return true;
    }

    // Checks if password is longer than 7 characters.
    function checkPasswordLength() {
        if (password1.length > 7) {
            return true;
        }
        setVerifiedPassword(true);
        setPassordError('Password is too short');
        return false;
    }

    // Checks if password or username conatin special characters.
    function checkForSpecialCharacters() {
        const specialCharacters = ['!', '@', '#', '$', '%', '^', '&', '*',
            '(', ')', '-', '_', '+', '=', '{', '}', '[', ']', '|', ':', ';',
            '"', '<', '>', '?', '/', '~', '`', '.'];
        for (let i = 0; i < specialCharacters.length; i++) {
            if (username.includes(specialCharacters[i])) {
                setVerifiedUsername(true);
                setUsernameError('Username contains forbidden character(s)');
                return false;
            }
            if (password1.includes(specialCharacters[i])) {
                setVerifiedPassword(true);
                setPassordError('Password contains forbidden character(s)');
                return false;
            }
        }
        return true;
    }

    // Checks if password contains a capital letter.
    function checkForCapitalLetters() {
        const capitalLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
            'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
            'W', 'X', 'Y', 'Z'];
        for (let i = 0; i < capitalLetters.length; i++) {
            if (password1.includes(capitalLetters[i])) {
                return true;
            }
        }
        setVerifiedPassword(true);
        setPassordError('Password must contain a capital letter');
        return false;
    }

    // Checks if password contains a number.
    function checkForNumbers() {
        const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        for (let i = 0; i < numbers.length; i++) {
            if (password1.includes(numbers[i])) {
                return true;
            }
        }
        setPassordError('Password must contain a number');
        setVerifiedPassword(true);
        return false;
    }

    // Checks if password contains a space.
    function checkForSpaces() {
        if (password1.includes(' ')) {
            setVerifiedPassword(true);
            setPassordError('Password cannot contain spaces');
        }
        if (username.includes(' ')) {
            setVerifiedUsername(true);
            setUsernameError('Username cannot contain spaces');
        }
        if (password1.includes(' ') || username.includes(' ')) {
            return false;
        }
        return true;
    }

    // Checks if password or username is empty.
    function checkForEmptyString() {
        if (password1 === '') {
            setVerifiedPassword(true);
            setPassordError('Password cannot be empty');
        }
        if (username === '') {
            setVerifiedUsername(true);
            setUsernameError('Username cannot be empty');
        }
        if (password1 === '' || username === '') {
            return false;
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
            }}>
                <Form noValidate>
                    {/* {showAlert && (
                        <Alert
                        variant="danger"
                        onClose={() => setShowAlert(false)}
                        style={{height: '90px'}}
                        dismissible>
                            <Alert.Heading>Sign Up Error</Alert.Heading>
                                <p> {errorMessage} </p>
                        </Alert>
                    )} */}
                    <h1>Sign Up</h1>
                    <br></br>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            isInvalid={verifiedUsername}
                            type="username"
                            placeholder="Username"
                            value={username}
                            onChange={(u) => setUsername(u.target.value)}/>
                        <Form.Control.Feedback type="invalid">
                            {usernameError}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <br></br>
                    <Form.Group controlId="formBasicPassword1">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            isInvalid={verifiedPassword}
                            type="password"
                            placeholder="Password"
                            value={password1}
                            onChange={(p) => setPassword1(p.target.value)}/>
                        <Form.Control.Feedback type="invalid">
                            {passwordError}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <br></br>
                    <Form.Group controlId="formBasicPassword2">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            isInvalid={verifiedPassword}
                            type="password"
                            placeholder="Password"
                            value={password2}
                            onChange={(p) => setPassword2(p.target.value)}/>
                        <Form.Control.Feedback type="invalid">
                            {passwordError}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <br></br>
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check
                        type="checkbox"
                        isInvalid={verifiedTerms}
                        label="I agree to the terms and conditions"
                        value={terms}
                        onChange={() => setTerms(!terms)}
                        style={{width: '280px'}}
                        />
                        <Form.Control.Feedback type="invalid">
                            You must agree to the terms and conditions
                        </Form.Control.Feedback>
                    </Form.Group>
                    <br></br>
                    <Col>
                        <Button variant="secondary" onClick={() => props.onChangeScreen('login')}>
                            Login Instead
                        </Button>
                        <Button variant="primary" type="submit" onClick={handleSubmit}>
                            Sign Up
                        </Button>
                    </Col>
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