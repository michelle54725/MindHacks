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
	for(point in path){
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
const emptyCell = {paths: [], bounds: {minX:0, minY:0, maxX:0, maxY:0}}

function newBounds(b1, b2){
	return {minX: Math.min(b1.minX, b2.minX), minY: Math.min(b1.minY, b2.minY), maxX: Math.max(b1.maxX, b2.maxX), maxY: Math.max(b1.maxY, b2.maxY)};
}

function addPath(cell, path){
	const newpath = cell.paths.slice()
	newpath = newpath.push(path)
	return {paths: newpath, bounds: newBounds(getBounds(path), cell.bounds)}
}

function DisplayCell(props){
	// const pathList = props.cell.paths.map((path) => pathList[])
	return(<g>
		<rect
			x={props.cell.bounds.minX-padding}
			y={props.cell.bounds.minY-padding}
			width={props.cell.bounds.maxX-props.cell.bounds.minX+padding+padding}
			height={props.cell.bounds.maxY-props.cell.bounds.minY+padding+padding}
			style="fill:rgb(255,255,255);stroke-width:3;stroke:rgb(0,0,0)"/>
		{props.cell.paths.map((path) => <DisplayPath path={path}/>)}
	</g>)
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
