import React, { Component } from 'react'
import './App.css'

class App extends Component {
  state = {
    text: ''
  }
  
componentDidMount() {
    this.fetchHello()
  }
  
fetchHello = async () => {
    const response = await fetch('/api/hello');
    const helloresponse = await response.json();
    const text = helloresponse.text;
    this.setState({ text });
  }

  render() {
    return (
      <div className="App">
        <h3>Hello from the client!</h3>
        <code>{this.state.text}</code>
      </div>
    )
  }
}
export default App