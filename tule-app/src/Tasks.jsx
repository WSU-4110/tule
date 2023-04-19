import TaskList from './components/TaskList'
import { AddTaskModal } from './AddTaskModal';
import React, { useState, useEffect, setOver, setUsers, fetchUserData } from "react"
import Button from 'react-bootstrap/Button';
import Navbar from './components/Navbar';
import banner from "./pics/sky.png";
import addIconLight from "./pics/addIcon-light.png";
import addIconDark from "./pics/addIcon-dark.png";
import progressTracker from './components/progressTracker';
const Tasks = (props) => {
    const [currentTasks, setCurrentTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    
    //Should return all of the tasks from database associated with the user.
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

    const handleSubmit = (e) => {
        console.log('Session Username: ', sessionStorage['Username']);
        console.log('Session Password: ', sessionStorage['Password']);
        e.preventDefault();
        console.log("add a task")
        setShowModal(true);
    }

    useEffect(() => {
        var result = getAllTasks();
        result.then((value) => {
            setCurrentTasks(value.InactiveTasks);
        })
    }
        ,[]
    )

    const myImageStyle = {width: "2000px", height: "343.3px"};
    const [over, setOver] = useState(false);

    
    return(
        <>
        {showModal && <AddTaskModal key={currentTasks.length} id={'task'+currentTasks.length} resetModal={setShowModal} currentTasks={currentTasks} update={setCurrentTasks}/>}
        <div>
            <Navbar text='Tule'/>
            <div>
                <img style={myImageStyle} src={banner} />
            </div>
            <div className='mt-4' onSubmit={handleSubmit}>
                <div className='container'>
                    <h1 className='mb-5'>Tasks</h1>
                </div>
                
                <progressTracker/>

                <section >
                    <TaskList ListOfTasks={currentTasks} currentTasks={currentTasks} update={setCurrentTasks}/>
                </section>



                <div onMouseOver={() => setOver(true)} onMouseOut={() => setOver(false)} className='container'>
                    <img title="Add Task" src={over ? addIconDark : addIconLight} onClick={handleSubmit}/>
                    <br />
                </div> 

                <button className='btn btn-primary mt-5 mb-10' onClick={() => props.onChangeScreen('schedule')}>Create Schedule</button>
            </div>
        </div>
        </>
    )
}

export default Tasks;