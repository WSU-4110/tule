function Button1(props){
    function nextPageHandler(){

        console.log('Clicked');
        console.log(props.text)
        return(
           <props.next/> 
        );
    }
    
    return(
        <div>
            <button className="btn" onClick={nextPageHandler}>{props.text}</button>
        </div>
    );
}

export default Button1;