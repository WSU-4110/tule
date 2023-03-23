
import Button from 'react-bootstrap/Button';
import Navbar from './components/Navbar';
import Form from 'react-bootstrap/Form';
import Col from "react-bootstrap/Col";

const Init = (props) => {

    return (
        <div>
            {/*<img src = {logo} style={{ width: 60, height: 60 }}></img>
            <h1>Tule</h1>*/}           

               <Navbar text="Tule"/>
               <div className='container'>
                    
                    <div className='v-align'>
                        <Navbar text="Tule"/>
                        <Button onClick={() => props.onChangeScreen('login')}>
                            Login
                        </Button>
                        <Button onClick={() => props.onChangeScreen('signup')}>
                            Sign up
                        </Button>
                    </div>
                </div> 
            {/* <button onClick={() => props.onChangeScreen('login')}>Login</button>
            <button onClick={() => props.onChangeScreen('signup')}>Sign up</button> */}
        </div>  
    )
}   

export default Init;