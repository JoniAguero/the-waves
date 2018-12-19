import React, { Component } from 'react';
import axios from 'axios'

class App extends Component {

  componentDidMount(){
    axios.get('http://localhost:1234/api/product/articles').then(res => {
      console.log(res);
    })
  }

  render() {
    return (
      <div className="App">
        
      </div>
    );
  }
}

export default App;
