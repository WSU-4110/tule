import TaskList from './components/TaskList'
import { AddTaskModal } from './AddTaskModal';
import React, { useState, useEffect, setUsers, fetchUserData } from "react"
import Button from 'react-bootstrap/Button';
import Navbar from './components/Navbar';
import banner from "./pics/sky.png";
import addIconLight from "./pics/addIcon-light.png";
import addIconDark from "./pics/addIcon-dark.png";
import DropDownMenu from './components/DropDownMenu';

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
    return(
        <>
        {showModal && <AddTaskModal key={currentTasks.length} id={'task'+currentTasks.length} resetModal={setShowModal} currentTasks={currentTasks} update={setCurrentTasks}/>}
        <div>
            <Navbar text='Tule'/>
            <DropDownMenu/>
            <div className="container">
                <img className="width-100" src={banner} />
            </div>
            <form className='mt-5' onSubmit={handleSubmit}>
                <div className='container'>
                    <h1 className='mb-5'>Tasks</h1>
                </div>

                <section >
                    <TaskList ListOfTasks={currentTasks} currentTasks={currentTasks} update={setCurrentTasks}/>
                </section>

                <div className='container'>
                    {/*<button className='btn btn-primary mb-5 mt-5' type="submit">Add task</button>*/}
                    {/*<Button variant="danger" className='mb-5 mt-5' type="submit" >Add task</Button>*/}
                    <img src={require({addIconLight})}
       onMouseOver={this.src = require({addIconDark})}
       onMouseOut={this.src = require({addIconLight})}  onClick={handleSubmit}/>
                    <br />
                 
                </div> 
                <button className='btn btn-secondary mt-5 mb-10' onClick={() => props.onChangeScreen('schedule')}>Create Schedule</button>
            </form>
        </div>
        </>
    )
}

export default Tasks;