import Button from 'react-bootstrap/Button';
import logo from './pics/alarm-clock.png';

const Init = (props) => {

    return (
        <div>
                <div className='center-hor-ver'>
                    <div>
                        <div>
                            <img style={{width:50, height: 50}} src={logo} alt="Alarm clock Icon" />
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
        </div>  
    )
}   

export default Init;