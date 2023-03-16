import Navbar from "./components/Navbar";
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

const Init = (props) => {

    return (
        
        <div>
            {/*<img src = {logo} style={{ width: 60, height: 60 }}></img>
            <h1> Tule </h1>*/}
            <Navbar text="Tule"/>
            <div className="btn-group">
                <button  className="btn-secondary" onClick={() => props.onChangeScreen('login')}>Login</button>

                <button className="btn-secondary" onClick={() => props.onChangeScreen('signup')}>Sign up</button>
            </div>
        </div>  
    )
}   

export default Init;