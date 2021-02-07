import React from 'react'
import './App.css'

import HelloClient from "./components/HelloClient.component";
import HelloAPI from "./components/HelloAPI.component"

function App() {

    return (
      <div className="App">
        <HelloClient />
        <HelloAPI />
      </div>
    );
}

export default App