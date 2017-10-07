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

//paths
const empty = []
function addToPath(path, point) {
//point: [x,y]
  const new_path = path.slice()
  new_path.push(point)
  return new_path
}

//view for path
function DisplayPath(props) {
    //svg expects strings, so convert to strings
  const pointStrings = props.path.map((each)=>each[0].toString() + ',' + each[1].toString())
  const pointSingleString = pointStrings.join(' ')
  return <polyline fill="none" stroke="black"
  points={pointSingleString}/>
}

let path = addToPath(empty, [100,100])
path = addToPath(path, [200,100])

class App extends Component {
  render() {
    return (
      <div>
        <em> A component!! </em>
        <MindHacks author='Oski' version={4}/>
        <svg>
        <DisplayPath path={path}/>
        </svg>
      </div>
    );
  }
}

export default App;
