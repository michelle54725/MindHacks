import React, { Component } from 'react';
import './App.css';
//components = anything that can be passed into <>

function MindHacks(props) {
//props = properties = stores data its representing, which is data that will be provided to Component to change)
  return <span> Author: {props.author}. Version: {props.version}.0. MindHacks!!! </span>;
//in later <MindHacks/> call: opening tag with slash at end = both opening/closing tags
}

// Developed by:
// William Brandon, Grace Lin, Myles Domingo, Michelle Mao

class App extends Component {
  render() {
    return (
      <div>
        <em> A component!! </em>
        <MindHacks author='Oski' version={4}/>
      </div>
    );
  }
}

export default App;
