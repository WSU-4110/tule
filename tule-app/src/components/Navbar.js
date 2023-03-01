import logo from "./alarm-clock.png";
import "../App.css";

function Navbar(props){
    return(<div className="mt-3 container">
            <div className="d-flex">
                <img src={logo} width={40} height={40} />
                <h1 className="px-2">{props.text}</h1>
            </div>
    </div>);
}

export default Navbar;