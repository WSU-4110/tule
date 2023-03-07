
import Button from 'react-bootstrap/Button';
import logo from "./alarm-clock.png";
import Navbar from './components/Navbar';
const Init = (props) => {

    return (
        
        <div>
            <img src = {logo} style={{ width: 60, height: 60 }}></img>
            <h1>Tule</h1>
            <button onClick={() => props.onChangeScreen('login')}>Login</button>
            <button onClick={() => props.onChangeScreen('signup')}>Sign up</button>
        </div>  
    )
}   

export default Init;