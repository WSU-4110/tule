

const loadTasks = (tasks) => {
    const [taskList, setTaskList] = useState([]);
    const [activeHours, setActiveHours] = useState(Array.from({length: (24-9)}, (_,i) => 9+i));
    const [procede, setProcede] = useState(false);

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
            return await response.json();
        }
        catch(err){
            console.log(err);
        }
    }
    
    useEffect(() => {
        var result = getAllTasks();
        result.then((value) => {
            setTaskList(value.InactiveTasks);
            console.log(taskList);
        })
    }
        ,[activeHours]
    )

    if (tasks.length !== 0) {
        setProcede(true);
    }

    return (
        <>
            {(procede) && ()}
        </>
    )

}

export default loadTasks;