import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";



function progressTracker(props){
    //This component displays the user's task completion progress
    var numOfActiveTasks = props.ActiveTasks.length;
    var numOfCompleteTasks = 0;
    var counter = numOfActiveTasks;

    while(counter > 0){
        if(props.task.Complete){
            numOfCompleteTasks++;
        }
        counter--;
    }

    var percentage = ((numOfCompleteTasks/numOfActiveTasks) * 100);

    return(
            <div>
               <CircularProgressbar value={percentage} text={`${percentage}%`} strokeWidth={5}/>
            </div>
    );

}

export default progressTracker;