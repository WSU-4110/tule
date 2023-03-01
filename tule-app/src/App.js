import { useState } from 'react';
import './App.css';
import Init from "./Init";
import Login from "./Login";
import {SignUp} from "./SignUp";


function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const changeCurrentScreen = (screen) =>{
    console.log(screen);
    setCurrentScreen(screen);
  }
  const displayScreen = () =>{
    switch(currentScreen){
      case 'login':
        return <Login onChangeScreen={changeCurrentScreen}/>
      case 'signup':
        return <SignUp onChangeScreen={changeCurrentScreen}/>
      default:
        return <Init onChangeScreen={changeCurrentScreen}/>
    }
  }
  return (
    <div className="App">
      {
        displayScreen()
        /*currentScreen === 'signup'? <SignUp onChangeScreen={changeCurrentScreen}/> : <Login onChangeScreen={changeCurrentScreen}/>*/
      }
    </div>
  );
}

export default App;
