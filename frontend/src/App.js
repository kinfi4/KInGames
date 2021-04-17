import React, {useEffect} from "react";
import {BrowserRouter} from 'react-router-dom'
import MainApp from "./components/main/MainApp";
import 'bootstrap/dist/css/bootstrap.css';
import './App.css'
import store from "./redux/store";
import {loadUser} from "./redux/reducers/authReducer";


function App() {
    useEffect(() => {
        store.dispatch(loadUser())
    })
    
  return (
      <BrowserRouter >
        <div className="App">
            <MainApp />
        </div>
      </BrowserRouter>
  );
}

export default App;
