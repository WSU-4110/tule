import Button from 'react-bootstrap/Button';
import Navbar from './components/Navbar';
import Form from 'react-bootstrap/Form';
import Col from "react-bootstrap/Col";

const Init = (props) => {

    return (
        <div>
            {/*<img src = {logo} style={{ width: 60, height: 60 }}></img>
            <h1>Tule</h1>*/}           
               <div className='container'>
                    
                    <div className='position-absolute top-40 right-40'>
                        <div className='container mb-3'>
                            
                            <div className='position-relative left-40 mb-3'><Navbar/></div>
                            <p>Welcome to Tule</p>
                            <p>Log in with your account to continue</p>    
                        </div>
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