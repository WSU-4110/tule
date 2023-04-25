
import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { easeQuadInOut } from "d3-ease";
import { EditTaskModal } from "../EditTaskModal";





function ProgressTracker(){

    const [user, setUser] = useState();

    async function getAllTasks(){
        try{
            const response = await fetch("http://localhost:3001/GetAllTasks",{
                method:'POST',
                mode:'cors',
                headers:{
                "Access-Control-Allow-Origin":'http://localhost:3000',
                "Content-Type":'application/json' 
                },
                body:JSON.stringify({
                    "Username":sessionStorage["Username"],
                    "Password":sessionStorage["Password"]
                })
            })
            
            return response.json(); 
        }
    
        catch(err){
            console.log(err);
        }
    }
    
    useEffect(() => {
        var result = getAllTasks();
        result.then((value) => {
            setUser(value);
        })
    },[]
    )
   
    //This component displays the user's task completion progress
    if(user != null){
    const totalTasks = user['ActiveTasks'].length + user['InactiveTasks'].length;

    var numOfCompleteTasks = 0;

    for(var i = 0; i < user['ActiveTasks'].length; i++ )
    {
        if(user['ActiveTasks'][i].Complete){
            numOfCompleteTasks++;
        }
    }

    for(var i = 0; i < user['InactiveTasks'].length; i++ )
    {
        if(user['InactiveTasks'][i].Complete){
            numOfCompleteTasks++;
        }
    }

    var percentage = Math.round(((numOfCompleteTasks/totalTasks) * 100));
    }

    return(
            <div>
               <CircularProgressbar data-testid="progress" value={percentage} text={`${percentage}%`} strokeWidth={5}
               buildStyles/>
            </div>
    );


    }

export default ProgressTracker;