import { useNavigate } from "react-router-dom";
function Button1(props){
    
    function nextPageHandler(){

        console.log('Clicked');
        console.log(props.text)
        return(
           <props.next/> 
        );
    }
    const navigate = useNavigate();

    return(
        <div>
            <button className="btn" onClick={() => navigate({nextPageHandler})}>{props.text}</button>
        </div>
    );
}

export default Button1;