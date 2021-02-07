import React, { Component } from 'react';

class HelloAPI extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: ''
    }
  }
  
componentDidMount() {
    this.fetchHello()
  }
  
fetchHello = async () => {
    const response = await fetch('/api/hello');
    const helloresponse = await response.json();
    this.setState({ text: helloresponse.text });
  }

  render() {
    return (
        <code>{this.state.text}</code>
    )
  }
}

export default HelloAPI