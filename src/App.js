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
	if (cell.currentPath !== null) {
		console.warn('Already have a current path!');
	}
  return {
    currentPath: empty,
    paths: cell.paths,
    bounds: cell.bounds,
  };
}

function completePath(cell){
  if (cell.currentPath === null) {
    console.warn("No path to complete!");
		return cell;
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
    console.warn("No path to add to!");
		return cell;
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

function DisplayCell(props) {
	function eventRelativePoint(event) {
		const boundingRect = event.target.getBoundingClientRect();
		return [
			event.pageX - boundingRect.x - padding + props.cell.bounds.minX,
			event.pageY - boundingRect.y - padding + props.cell.bounds.minY,
		];
	}

	const x = props.cell.bounds.minX - padding;
	const y = props.cell.bounds.minY - padding;
	const width = props.cell.bounds.maxX - props.cell.bounds.minX + padding + padding;
	const height = props.cell.bounds.maxY - props.cell.bounds.minY + padding + padding;

	let currentDisplayed = null;
>>>>>>> cc66b75e3d0ec742f8bd36bb69abc7b626d36cee
  if (props.cell.currentPath !== null) {
    currentDisplayed = <DisplayPath path={props.cell.currentPath}/>;
  }

	const handleInitiate = (event) => {
		const point = eventRelativePoint(event);
		let newCell = props.cell;
		newCell = initializePath(newCell);
		newCell = addToCurrentPath(newCell, point);
		props.onCellUpdate(newCell);
	};

	const handleAdd = (event) => {
		if (props.cell.currentPath !== null) {
			const point = eventRelativePoint(event);
			props.onCellUpdate(addToCurrentPath(props.cell, point));
		}
	};

	const handleComplete = (event) => {
		const point = eventRelativePoint(event);
		props.onCellUpdate(completePath(props.cell, point));
	}

  return(<g>
		<rect x={x} y={y} width={width} height={height}
			style={{fill:'rgb(255,255,255)','strokeWidth':'3','stroke':'rgb(0,0,0)'}}
		/>
		<DisplayPaths paths={props.cell.paths}/>
    {currentDisplayed}
		<rect x={x} y={y} width={width} height={height}
			fill="transparent"
			stroke="tranparent"
			onMouseDown={handleInitiate}
			onMouseMove={handleAdd}
			onMouseUp={handleComplete}
			onMouseLeave={handleComplete}
		/>
	</g>);
}

//cells = object (dict); children = array of objects (whose elements are note nodes)
function makeNoteNode(cell, children) {
  let tree = {cell: cell, children: children}
}

class App extends Component {
	constructor() {
		super()
		this.state = { cell: emptyCell };
	}

  render() {
    return (
      <div>
        <em> A component!! </em>
        <MindHacks author='Oski' version={4}/>
        <svg width="500" height="500">
					<g transform="translate(250, 250)">
						<DisplayCell
							cell={this.state.cell}
							onCellUpdate={(newCell) => this.setState({cell: newCell})}
						/>
					</g>
        </svg>
      </div>
    );
  }
}

export default App;
