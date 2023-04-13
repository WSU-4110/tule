import TaskList from './components/TaskList'
import { AddTaskModal } from './AddTaskModal';
import React, { useState, useEffect, setUsers, fetchUserData } from "react"
import Button from 'react-bootstrap/Button';
import Navbar from './components/Navbar';
import banner from "./pics/sky.png"
import DropDownMenu from './components/DropDownMenu';

const Tasks = (props) => {
    const [currentTasks, setCurrentTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const editTask = (index, newName, newStartTime, newDuration, newBreak, newDate, newDays, newPriority) =>{
    
        console.log("test");
        currentTasks[index].taskName = newName;
        currentTasks[index].startTime = newStartTime;
        currentTasks[index].duration = newDuration;
        currentTasks[index].break = newBreak;
        currentTasks[index].date = newDate;
        currentTasks[index].days = newDays;
        currentTasks[index].priority = newPriority;
        console.log(currentTasks);
    }
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
    return(
        <>
        {showModal && <AddTaskModal key={currentTasks.length} id={'task'+currentTasks.length} editTask={editTask} resetModal={setShowModal} currentTasks={currentTasks} update={setCurrentTasks}/>}
        <div>
            <Navbar text='Tule'/>
            <DropDownMenu/>
            <div className="container">
                <img className="width-100" src={banner} />
            </div>
            <form className='mt-5' onSubmit={handleSubmit}>
                <h1>Tasks</h1>
                <section >
                    <TaskList ListOfTasks={currentTasks} editTask={editTask} currentTasks={currentTasks} update={setCurrentTasks}/>
                </section>

                <div className=''>
                    {/*<button className='btn btn-primary mb-5 mt-5' type="submit">Add task</button>*/}
                    <Button variant="danger" className='mb-5 mt-5' type="submit" >Add task</Button>
                    
                    <br />
                    <button className='btn btn-secondary mt-5 mb-10' onClick={() => props.onChangeScreen('schedule')}>Create Schedule</button>
                </div> 
            </form>
        </div>
        </>
    )
}

export default Tasks;