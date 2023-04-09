import React, { useState } from "react"
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from "react-bootstrap/Col";
import Navbar from "./components/Navbar";

async function setSessionVariables(username, password){
    sessionStorage['Username'] = username;
    sessionStorage['Password'] = password;
}

const Login = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [verifiedUsername, setVerifiedUsername] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    const [verifiedPassword, setVerifiedPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        console.log(username);
        console.log(password);
        var data = {}
        try{
            const response = await fetch('http://localhost:3001/LoginVerify',{
                method:'POST',
                mode:'cors',
                headers:{
                    'Access-Control-Allow-Origin':'http://localhost:3000',
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    'Username':username,
                    'Password':password
                })
            })
            data = await response.json();
            console.log(data);
        }
        catch(err){
            console.log(err);
        }
        if (data['LoginSuccess'] === "True") {
            setSessionVariables(username, password);
            console.log('Session Username: ', username);
            console.log('Session Password: ', password);
            props.onChangeScreen('tasks');
        } else if(data['BadPass'] === "True"){
            setPasswordError('Invalid Credentials Retry')
            setVerifiedPassword(true);
        } else if (username === '' && password === '') {
            setVerifiedUsername(true);
            setVerifiedPassword(true);
            setUsernameError('Please enter a username');
            setPasswordError('Please enter a password');
            return;
        } else if (username === '') {
            setVerifiedUsername(true);
            setUsernameError('Please enter a username');
            return;
        } else if (password === '') {
            setVerifiedPassword(true);
            setPasswordError('Please enter a password');
            return;
        } else {
            setVerifiedUsername(true);
            setVerifiedPassword(true);
            setPasswordError('Invalid username or password');
            return;
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
            }} className='center-hor-ver'>
                <Form noValidate>
                    <h1>Login</h1>
                    <br></br>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                        type="username"
                        placeholder="Username"
                        value={username}
                        isInvalid={verifiedUsername}
                        onChange={(u) => setUsername(u.target.value)}/>
                        <Form.Control.Feedback type="invalid">
                            {usernameError}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <br></br>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        isInvalid={verifiedPassword}
                        onChange={(p) => setPassword(p.target.value)}/>
                        <Form.Control.Feedback type="invalid">
                            {passwordError}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <br></br>
                    <Col>
                        <Button variant="primary" onClick={() => props.onChangeScreen('')}>
                            Back
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