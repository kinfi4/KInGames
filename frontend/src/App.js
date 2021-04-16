import React from "react";
import {BrowserRouter} from 'react-router-dom'
import MainApp from "./components/main/MainApp";

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
