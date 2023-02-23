import Button1 from "./components/Button1";
function Init(){
    return( 
        <div className='card'>
            <Button1 text='Login' next='Login'/>
            <Button1 text='Sign Up'/>
        </div>
    );
}

export default Init;