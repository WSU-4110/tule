import React, { useState } from "react"

export const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [terms, setTerms] = useState(false);

    // Handles form submission.
    // Checks if all conditions are met.
    const handleSubmit = (e) => {
        e.preventDefault();
        if (terms) {
            if (checkForSpecialCharacters()) {
                if (checkPasswordsMatch()) {
                    if (checkPasswordLength()) {
                            console.log(username);
                            console.log(password1);
                    } else {
                        console.log('password too short');
                    }
                } else {
                    console.log('passwords do not match');
                }
            } else {
                console.log('username/password contains special characters');
            }
        } else {
            console.log('please agree to terms and conditions');
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
        <form onSubmit={handleSubmit}>
            <h1>Sign Up Page</h1>
            <label style={{marginRight: '20px'}} htmlFor="username">Username</label>
            <input value={username} onChange={(u) => setUsername(u.target.value)} type="username" placeholder="Username"></input>
            <br></br>
            <label style={{marginRight: '20px'}} htmlFor="password">Password</label>
            <input value={password1} onChange={(p) => setPassword1(p.target.value)} type="password" placeholder="********"></input>
            <br></br>
            <label style={{marginRight: '20px'}} htmlFor="password">Confirm password</label>
            <input value={password2} onChange={(p) => setPassword2(p.target.value)} type="password" placeholder="********"></input>
            <br></br>
            <input type={"checkbox"} value={terms} onChange={(t) => setTerms(!terms)}></input>
            <label style={{marginRight: '20px'}} htmlFor="terms">I agree to the terms and conditions</label>
            <br></br>
            <button type="submit">Submit</button>
        </form>
    )
}