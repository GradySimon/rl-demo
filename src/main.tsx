import * as d3 from 'd3';
import { min } from 'd3';
import * as React from "react";
import * as ReactDOM from "react-dom";
import { join } from 'path';

import * as rl from "./rl";
import * as messages from "./messages";
import RLWorker from "./RLWorker";

// TODO: factor out a D3Component superclass

export type GridProps = {
  width: number,
  height: number,
  rows: number,
  cols: number,
  agentCoords: rl.GridCoords
  gridCells: Array<Array<number>>
}

type CellContent = number | string;

type GridCell = {
  row: number,
  column: number,
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  content: CellContent;
}

export class Grid extends React.Component<GridProps, {}> {

  private node: SVGSVGElement;
  
  constructor(public props: GridProps) {
    super(props);
    this.callD3 = this.callD3.bind(this);
    this.cellData_ = this.cellData_.bind(this);
  }

  componentDidMount() {
    this.callD3();
  }

  componentDidUpdate() {
    this.callD3();
  }

  
  public get cellWidth() : number {
    return this.props.width / this.props.cols;
  }

  public get cellHeight() : number {
    return this.props.height / this.props.rows;
  } 
  

  private cellData_(): Array<GridCell> {
    let cells: Array<GridCell> = [];
    for (let i = 0; i < this.props.rows; ++i) {
      for (let j = 0; j < this.props.cols; j++) {
         cells.push({
          row: i,
          column: j,
          x: j * this.cellWidth,
          y: i * this.cellHeight,
          width: this.cellWidth,
          height: this.cellHeight,
          color: "000",
          content: `(${i}, ${j})`,
        });
      }
    }
    return cells;
  }

  // Restructure this:
  // Cells are separate data from agent, separate data selections
  // Cells need only enter
  // Agent has enter and update (update is just the .data() call, no .update)
  // Side note: setting a key random key on the svg element in render worked 
  // to totally reset d3 with props updates
  // Ian recommended a foreach construct on D3 selections

  callD3() {
    const gridSvg = this.node;
    const cellData: Array<GridCell> = this.cellData_();
    const agentCoords: [number, number] = this.props.agentCoords;

    let cells = d3.select(this.node).selectAll('g.grid-cell')
      .data(cellData).enter()
      .append('g')
        .attr('class', 'grid-cell')
        .attr('transform', (cell => `translate(${cell.x}, ${cell.y})`))
        .style('text-anchor', 'middle');

    let cellContents = 
      cells.append('rect')
        .attr('class', 'grid-cell-background')
        .attr('width', cell => cell.width)
        .attr('height', cell => cell.height)
        .attr('rx', 20)
        .attr('ry', 20)
        .attr('fill', "pink")
      
    cells.append('text')
        .attr('x', cell => cell.width / 2)
        .attr('y', cell => cell.height / 2)
        .style('font-family', 'sans-serif')
        .style('font-size', '30px')
        .text(cell => cell.content);

    let boundAgentCoords =
      d3.select(this.node).selectAll('circle.agent').data([agentCoords])

    boundAgentCoords.enter()
      .append('circle')
        .classed('agent', true)
        .attr('cx', coords => coords[1] * this.cellWidth + this.cellWidth / 2)
        .attr('cy', coords => coords[0] * this.cellHeight +this.cellHeight / 2)
        .attr('r', coords => Math.min(this.cellWidth, this.cellHeight) / 2 - 5);
    
    boundAgentCoords
      .attr('cx', coords => coords[1] * this.cellWidth + this.cellWidth / 2)
      .attr('cy', coords => coords[0] * this.cellHeight + this.cellHeight / 2);
  }

  render() {
    return <svg ref={node => this.node = node}
                width={this.props.width} height={this.props.height}></svg>;
  }
}

type StepControlsProps = {
  onStepClick: () => void,
}

function StepControls(props: StepControlsProps) {
  return (
    <div className="step-controls">
      <button className="step-button" onClick={props.onStepClick}>Step</button>
    </div>
  );
}

export type GridWorldExampleState = {
  gridWorldState: rl.GridWorldState,
}

function DebugDisplay(props: {name: string, value: any}) {
  return (
    <div className="debug-display">
      <h5 className="debug-display-title">{props.name}</h5>
      <pre>{JSON.stringify(props.value, null, 2)}</pre>
    </div>
  );
}


// Create GridWorld worker, manage in lifecycle methods
// Create step button with callback prop for telling the worker to step.
export class GridWorldExample extends React.Component<{}, GridWorldExampleState> {
  state: GridWorldExampleState = {
    gridWorldState: {agentCoords: [3, 3], final: false}
  };
  private worker: Worker;

  componentWillMount() {
    this.worker = new RLWorker();
    this.worker.onmessage = this.handlerWorkerMessage;
  }

  handlerWorkerMessage = (event: MessageEvent) => {
    messages.log(event.data);
    this.setState({gridWorldState: event.data.gridWorldState});
  }

  handleStepClick = () => {
    this.worker.postMessage({'type': 'step'});
  }

  render() {
    return (
      <>
        <h1 className="example-title">Grid World</h1>
        <StepControls onStepClick={this.handleStepClick} />
        <Grid width={500} height={500} rows={4} cols={4}
              gridCells={[[1, 2], [3, 4]]}
              agentCoords={this.state.gridWorldState.agentCoords} />
        <DebugDisplay name="GridWorldExample state" value={this.state} />
      </>
    );
  }
}

ReactDOM.render(<GridWorldExample />, document.getElementById("app"));
