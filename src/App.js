import React, { Component } from 'react';
import './App.css';
//components = anything that can be passed into <>

function Title(props) {
//props = properties = stores data its representing, which is data that will be provided to Component to change)
  return (
    <div id="Title">
    <h1> Welcome {props.name}! Damn, look at your MindHack: </h1>
      <h2> Author: {props.author}. Version: {props.version}.0.</h2>;
    </div>
  )
}
  //in later <MindHacks/> call: opening tag with slash at end = both opening/closing tags

function Paragraph(props) {
//props = properties = stores data its representing, which is data that will be provided to Component to change)
  return <p> This is paragraph #{props.paragraph}</p>;
//in later <MindHacks/> call: opening tag with slash at end = both opening/closing tags
}

class App extends Component {
  render() {
    return (
      <div>
        <Title name='Name' author='Oski' version={4}/><br />
        <Paragraph paragraph={1}/>
        </div>
       );
  }
}

export default App
