import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { easeQuadInOut } from "d3-ease";


function ProgressTracker(props){
    //This component displays the user's task completion progress
    const [user, setUser] = useState(props.task);
    const totalTasks = props.task._id;
    var numOfCompleteTasks = 0;
    var counter = totalTasks;

    while(counter > 0){
        if(props.task.Complete){
            numOfCompleteTasks++;
        }
        counter--;
    }

    var percentage = ((numOfCompleteTasks/totalTasks) * 100);

    return(
            <div>
               <CircularProgressbar value={percentage} text={`${percentage}%`} strokeWidth={5}
               buildStyles/>
            </div>
    );

}

export default ProgressTracker;