import React, { Component } from 'react';
import './App.css';
//components = anything that can be passed into <>

function MindHacks(props) {
//props = properties = stores data its representing, which is data that will be provided to Component to change)
  return <span> Author: {props.author}. Version: {props.version}.0. MindHacks!!! </span>;
//in later <MindHacks/> call: opening tag with slash at end = both opening/closing tags
}

// Developed by:
// Grace Lin, Myles Domingo, Michelle Mao

// Mentored by:
// William Brandon

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
  return <polyline fill="none" stroke="black" points={props.path}/>;
}

//Test
let path = addToPath(empty, [100,100])
path = addToPath(path, [200,100])

function getBounds(path) {
	if (path.length == 0) {
		throw new Error("Path has no points");
	}
	let minX = path[0][0];
	let minY = path[0][1];
	let maxX = path[0][0];
	let maxY = path[0][1];
	for(let point in path){
		minX = Math.min(minX, point[0]);
		minY = Math.min(minY, point[1]);
		maxX = Math.max(maxX, point[0]);
		maxY = Math.max(maxY, point[1]);
	}
	return {minX: minX, minY: minY, maxX: maxX, maxY: maxY};
}

//Cell takes the min and max values of corresponding paths
//Initial default cell
const padding = 40
const emptyCell = {currentPath: null, paths: [], bounds: {minX:0, minY:0, maxX:0, maxY:0}}

function extendBounds(bounds, point) {
  return {
    minX: Math.min(bounds.minX, point[0]),
    minY: Math.min(bounds.minY, point[1]),
    maxX: Math.max(bounds.maxX, point[0]),
    maxY: Math.max(bounds.maxY, point[1]),
  };
}

function initializePath(cell) {
  return {
    currentPath: empty,
    paths: cell.paths,
    bounds: cell.bounds,
  };
}

function completePath(cell){
  if (cell.currentPath === null) {
    throw new Error("No path to complete!");
  }
  const newPaths = cell.paths.slice();
  newPaths.push(cell.currentPath);
  return {
    currentPath: null,
    paths: newPaths,
    bounds: cell.bounds,
  };
}

function addToCurrentPath(cell, point) {
  if (cell.currentPath === null) {
    throw new Error("No path to add to!");
  }
  return {
      currentPath: addToPath(cell.currentPath, point),
      paths: cell.paths,
      bounds: extendBounds(cell.bounds, point),
  };
}

function DisplayPaths(props) {
  return <g>
    {props.paths.map((path) => <DisplayPath path={path}/>)}
  </g>;
}

function DisplayCell(props){
  let currentDisplayed = null;
  if (props.cell.currentPath !== null) {
    currentDisplayed = <DisplayPath path={props.cell.currentPath}/>;
  }
  return(<g>
		<rect
			x={props.cell.bounds.minX-padding}
			y={props.cell.bounds.minY-padding}
			width={props.cell.bounds.maxX-props.cell.bounds.minX+padding+padding}
			height={props.cell.bounds.maxY-props.cell.bounds.minY+padding+padding}
			style="fill:rgb(255,255,255);stroke-width:3;stroke:rgb(0,0,0)"/>
		<DisplayPaths paths={props.cell.paths}/>
    {currentDisplayed}
	</g>);
}

//cells = object (dict); children = array of objects (whose elements are note nodes)
function makeNoteNode(cell, children) {
  let tree = {cell: cell, children: children}
}

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
