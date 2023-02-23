import React, { useState } from "react"

export const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (checkPasswordsMatch()) {
            if (checkPasswordLength()) {
                console.log(username);
                console.log(password1);
                //fetch request
                fetch()
            } else {
                console.log('password too short');
            }
        } else {
            console.log('passwords do not match');
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
    
    return(
        <form onSubmit={handleSubmit}>
            <h1>Login Page</h1>
            <label htmlFor="username">username</label>
            <input value={username} onChange={(u) => setUsername(u.target.value)} type="username" placeholder="username"></input>
            <br></br>
            <label htmlFor="password">password1</label>
            <input value={password1} onChange={(p) => setPassword1(p.target.value)} type="password" placeholder="********"></input>
            <br></br>
            <label htmlFor="password">password2</label>
            <input value={password2} onChange={(p) => setPassword2(p.target.value)} type="password" placeholder="********"></input>
            <br></br>
            <button type="submit">Submit</button>
        </form>
    )
}