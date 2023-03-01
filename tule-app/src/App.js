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
        <Login onChangeScreen={changeCurrentScreen}/>
        break;
      case 'signup':
        <SignUp onChangeScreen={changeCurrentScreen}/>
        break;
      default:
        <Init onChangeScreen={changeCurrentScreen}/>
        break;
    }
  }
  return (
    <div className="App">
      {
        currentScreen === 'signup'? <SignUp onChangeScreen={changeCurrentScreen}/> : <Login onChangeScreen={changeCurrentScreen}/>
      }
    </div>
  );
}

export default App;
