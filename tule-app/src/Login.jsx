import React, { useState } from "react"
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Col from "react-bootstrap/Col";
import Navbar from "./components/Navbar";

const Login = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(username);
        console.log(password);
        if (username === 'admin' && password === 'admin') {
            props.onChangeScreen('tasks')
        } else if (username === '' && password === '') {
            setShowAlert(true);
            setErrorMessage('Please enter a username and password');
            return;
        } else if (username === '') {
            setShowAlert(true);
            setErrorMessage('Please enter a username');
            return;
        } else if (password === '') {
            setShowAlert(true);
            setErrorMessage('Please enter a password');
            return;
        } else {
            setShowAlert(true);
            setErrorMessage('Incorrect username or password');
        }
        //fetch request
        //fetch()

        
    }
    
    return(
        <>
        <Navbar text="Tule"/>
            <div
            style={{
                width: '30%',
                margin: 'auto',
            }}>
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
                    <h1>Login</h1>
                    <br></br>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="username" placeholder="Username" value={username} onChange={(u) => setUsername(u.target.value)}/>
                    </Form.Group>
                    <br></br>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password} onChange={(p) => setPassword(p.target.value)}/>
                    </Form.Group>
                    <br></br>
                    <Col>
                        <Button variant="secondary" onClick={() => props.onChangeScreen('signup')}>
                            Sign Up Instead
                        </Button>
                        <Button variant="primary" type="submit" onClick={handleSubmit}>
                            Login
                        </Button>
                    </Col>

                </Form>
            </div>
        </>
        // <form onSubmit={handleSubmit}>
        //     <h1>Login Page</h1>
        //     <label htmlFor="username">username</label>
        //     <input value={username} onChange={(u) => setUsername(u.target.value)} type="username" placeholder="username"></input>
        //     <br></br>
        //     <label htmlFor="password">password</label>
        //     <input value={password} onChange={(p) => setPassword(p.target.value)} type="password" placeholder="********"></input>
        //     <br></br>
        //     <button type="submit">Submit</button>
        //     <button onClick={() => props.onChangeScreen('signup')}>Sign up instead</button>
        //     <br></br>
        //     <button onClick={() => props.onChangeScreen('init')}>Go to init temp button</button>
        //     <button onClick={() => props.onChangeScreen('tasks')}>successful login temp button</button>
        // </form>
    )
}

export default Login;