import Button from 'react-bootstrap/Button';
import logo from "./alarm-clock.png";
import { Link } from "react-router-dom";
const Init = () => {
    return (
        <div>
           <div className="mt-3 container">
                <div className="d-flex">
                    <img src={logo} width={40} height={40} />
                    <h1 className="px-2">Tule</h1>
                </div>
            </div>
            <div>
                <div className="mt-5">
                    <Button className="px-4"><Link to="/login">Login</Link></Button>
                    <Button className="px-3">Sign Up</Button>
                </div>
            </div> 
        </div>
        
    );
};    
export default Init;