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
  return <polyline fill="none" stroke="black" strokeWidth={2} points={props.path}/>;
}

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
			event.clientX - boundingRect.x - padding + props.cell.bounds.minX,
			event.clientY - boundingRect.y - padding + props.cell.bounds.minY,
		];
	}

	const x = props.cell.bounds.minX - padding;
	const y = props.cell.bounds.minY - padding;
	const width = props.cell.bounds.maxX - props.cell.bounds.minX + padding + padding;
	const height = props.cell.bounds.maxY - props.cell.bounds.minY + padding + padding;

	let currentDisplayed = null;
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
      fill="rgb(240, 240, 240)"
      rx={3} ry={3}
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

const spacing = 20;
//cells = object (dict); children = array of objects (whose elements are note nodes)
function makeNoteNode(cell, children) {
  //find sum of max heights of children + padding
  let sumHeight = 0;
  children.forEach((child) => {
    sumHeight += child.maxHeight;
  });
  if (children.length > 0) {
    sumHeight += (children.length - 1) * spacing;
  }

  const intrinsicHeight = cell.bounds.maxY - cell.bounds.minY + padding * 2;
  const maxHeight = Math.max(intrinsicHeight, sumHeight);

  return {cell: cell, children: children, maxHeight: maxHeight};
}

function updateCell(NoteNode, newCell) {
  return makeNoteNode(newCell, NoteNode.children)
}

function updateChild(NoteNode, index, newChild) {
  const newChildren = NoteNode.children.slice()
  newChildren[index] = newChild
  return makeNoteNode(NoteNode.cell, newChildren)
}

const emptyNode = makeNoteNode(emptyCell, [])
function makeChild(NoteNode) {
  const newChildren = NoteNode.children.slice()
  newChildren.push(emptyNode)
  const newNode = makeNoteNode(NoteNode.cell, newChildren)
  return newNode
}

//layout algorithm. Take list of notenodes, figure out position for each one

const horizontalSpacingAspectRatio = 0.2;
const minHorizontalSpacing = 40;

function CurveBetween(props) {
  return <path
    d={`
      M ${props.x1} ${props.y1}
      C
        ${(props.x1 * 2 + props.x2) / 3} ${props.y1},
        ${(props.x1 + props.x2 * 2) / 3} ${props.y2},
        ${props.x2} ${props.y2}
    `}
    fill="none"
    stroke="black"
  />
}

// Component of note node
class DisplayNoteNode extends Component{
  constructor() {
    super() //calls the super class constructor

    this.childUpdateHandlers = [];
    this.cellUpdateHandler = (newCell) => {
      this.props.onNodeUpdate(updateCell(this.props.node, newCell));
    };
  }

  prepareChildUpdateHandlers() {
    while (this.childUpdateHandlers.length < this.props.node.children.length) {
      const index = this.childUpdateHandlers.length;
      this.childUpdateHandlers.push((newChild) => {
        this.props.onNodeUpdate(updateChild(this.props.node, index, newChild));
      });
    }
    this.childUpdateHandlers.length = this.props.node.children.length;
  }

  render() {
    const bounds = this.props.node.cell.bounds;
    const paddedWidth = bounds.maxX - bounds.minX + padding * 2;
    const paddedHeight = bounds.maxY - bounds.minY + padding * 2;
    const nodeCell = (
      <g>
        <g transform={`translate(${-bounds.minX + padding},${-bounds.minY + padding - paddedHeight / 2})`}>
          <DisplayCell
            cell={this.props.node.cell}
            onCellUpdate={this.cellUpdateHandler}
          />
        </g>
        <line
          x1={0} y1={paddedHeight / 2}
          x2={paddedWidth} y2={paddedHeight / 2}
          stroke="black"
        />
      </g>
    );
    const horizontalSpacing = Math.max(
      minHorizontalSpacing,
      horizontalSpacingAspectRatio * this.props.node.maxHeight
    );
    const childXPos = paddedWidth + horizontalSpacing;
    let childYTop = -this.props.node.maxHeight / 2;
    const positionedChildren = [];
    this.prepareChildUpdateHandlers();
    this.props.node.children.forEach((child, index) => {
      const childYPos = childYTop + child.maxHeight / 2;
      const childConnectY = childYPos + (child.cell.bounds.maxY - child.cell.bounds.minY) / 2 + padding;
      positionedChildren.push(<g>
        <CurveBetween
          x1={paddedWidth} y1={paddedHeight / 2}
          x2={childXPos} y2={childConnectY}
        />
        <g transform={`translate(${childXPos},${childYPos})`}>
          <DisplayNoteNode
            node={child}
            onNodeUpdate={this.childUpdateHandlers[index]}
          />
        </g>
      </g>);
      childYTop += child.maxHeight + spacing;
    });
    return <g>
      {nodeCell}
      {positionedChildren}
      <circle
        cx={paddedWidth} cy={paddedHeight / 2}
        r={10}
        fill="rgb(150,150,150)"
        onClick={(event) => {
          this.props.onNodeUpdate(makeChild(this.props.node))
        }}
      />
    </g>;
  }
}

class App extends Component {
	constructor() {
		super()
		this.state = { node: emptyNode };
	}

  render() {
    return (
      <div>
        <em> A component!! </em>
        <MindHacks author='Oski' version={4}/>
        <svg width="10000" height="10000">
					<g transform="translate(500, 500)">
            <DisplayNoteNode
              node={this.state.node}
              onNodeUpdate={(newNode) => {
                this.setState({ node: newNode });
              }}
            />
					</g>
        </svg>
      </div>
    );
  }
}

export default App;
