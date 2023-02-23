import './App.css';
import Init from "./Init";
import Login from "./Login";
//import Login from "./Login"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

function App() {
  return (
    // <div className="App">
    //   <Init />
    // </div>

    <>
    {/* This is the alias of BrowserRouter i.e. Router */}
    <Router>
      <Switch>
        {/* This route is for home component 
        with exact path "/", in component props 
        we passes the imported component*/}
        <Route exact path="/" component={Init} />
          
        {/* This route is for about component 
        with exact path "/about", in component 
        props we passes the imported component*/}
        <Route path="/login" component={Login} />
          
        {/* If any route mismatches the upper 
        route endpoints then, redirect triggers 
        and redirects app to home component with to="/" */}
        <Redirect to="/" />
      </Switch>
    </Router>
    </>
  );
}

export default App;
