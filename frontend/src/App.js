import React from "react";
import {BrowserRouter} from 'react-router-dom'
import MainApp from "./components/main/MainApp";
import 'bootstrap/dist/css/bootstrap.css';
import './App.css'


function App() {
  return (
      <BrowserRouter >
        <div className="App">
            <MainApp />
        </div>
      </BrowserRouter>
  );
}

export default App;
