import logo from "./alarm-clock.png";
import "../App.css";
function Navbar(props){
    return(
        <div className="">
            <div className="ml-3">
                    <div className="mt-3 offset-md-1">
                        <img className="float-start" src={logo} width={40} height={40} />
                        <h1 className="float-start px-2">{props.text}</h1>
                    </div>
            </div>
        </div>
    );
}

export default Navbar;