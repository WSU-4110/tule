import Banner from "./components/Banner";
import Navbar from "./components/Navbar";
function Schedule(props){

    return(
        <div>
            <Navbar text='Tule'/>
            <Banner/>
            <button className="btn btn-primary mt-5" onClick={() => props.onChangeScreen('tasks')}>
                Back
            </button>
            <button className="btn btn-primary mt-5" onClick={() => props.onChangeScreen('')}>
               logout
            </button>
        </div>
    );
}

export default Schedule;