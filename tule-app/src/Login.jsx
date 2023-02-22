import React, { useState } from "react"

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(username);
        console.log(password);
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
        </form>
    )
}