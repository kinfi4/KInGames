import React, {useEffect} from "react";
import {BrowserRouter} from 'react-router-dom'
import MainApp from "./components/main/MainApp";
import 'bootstrap/dist/css/bootstrap.css';
import './App.css'
import store from "./redux/store";
import {loadUser} from "./redux/reducers/authReducer";
import 'react-notifications-component/dist/theme.css';
import 'animate.css';
import ReactNotifications from "react-notifications-component";


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
