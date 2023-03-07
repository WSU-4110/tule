import React, { useState } from "react"

const Login = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(username);
        console.log(password);
        //fetch request
        //fetch()
    }
    
    return(
        <form onSubmit={handleSubmit}>
            <h1>Login Page</h1>
            <label htmlFor="username">username</label>
            <input value={username} onChange={(u) => setUsername(u.target.value)} type="username" placeholder="username"></input>
            <br></br>
            <label htmlFor="password">password</label>
            <input value={password} onChange={(p) => setPassword(p.target.value)} type="password" placeholder="********"></input>
            <br></br>
            <button type="submit">Submit</button>
            <button onClick={() => props.onChangeScreen('signup')}>Sign up instead</button>
            <br></br>
            <button onClick={() => props.onChangeScreen('init')}>Go to init temp button</button>
            <button onClick={() => props.onChangeScreen('tasks')}>successful login temp button</button>
        </form>
    )
}

export default Login;