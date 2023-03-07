import React, {useState} from "react"
import Button from 'react-bootstrap/Button';
//import logo from "./alarm-clock.png";
import Navbar from './components/Navbar';
const Init = (props) => {

    return (
        
        <div>
           {/* <div className="mt-3 container">
                <div className="d-flex">
                    <img src={logo} width={40} height={40} />
                    <h1 className="px-2">Tule</h1>
                </div>
            </div> */}
            <Navbar text="Tule"/>
            <div>
                <div className="mt-5">
                    <Button className="px-4" onClick={() => props.onChangeScreen('login')}>Login</Button>
                    <Button className="px-3" onClick={() => props.onChangeScreen('signup')}>Sign Up</Button>
                </div>
        </div>

        </div>  
    )
}   

export default Init;