import * as dl from 'deeplearn';
import * as d3 from 'd3';
import * as React from "react";
import * as ReactDOM from "react-dom";
import { join } from 'path';

import * as workerPath from "file-loader?name=[name].js!./demo.worker";

const worker = new Worker(workerPath);

interface Environment {

}

/** 
 * Something that can select actions in the face of observations.
*/
interface Agent<ObservationT, ActionT> {
  /**
   * Choose and return a concrete action based on the given observation
   * @param obersvation the observation to act upon
   */
  act(observation: ObservationT): ActionT
}

// Maybe action distributions should live in tensorflow, not here
interface ActionDistribution<ActionT> {
  (action: ActionT): number 
}

// Interface for thing that can be trained by reinforcement learning?

interface Policy<ObservationT, ActionT> {
  (observation: ObservationT): ActionDistribution<ActionT>
}

class ExampleAgent implements Agent<number, boolean> {
  constructor(private policy: Policy<number, boolean>) {}
  act(observation: number): boolean {
    return false;
  }
}

async function runExample() {
  const a = dl.tensor1d([1, 2, 3]);
  const b = dl.scalar(2);
 
  const result = a.add(b);

  // Option 1: With async/await.
  // Caveat: in non-Chrome browsers you need to put this in an async function.
  // console.log(await result.data());  // Float32Array([3, 4, 5])
  let resolvedData = await result.data();
  d3.select("body").append("span").text(resolvedData.toString());
  // // Option 2: With a Promise.
  // result.data().then(data => console.log(data));

  // // Option 3: Synchronous download of data.
  // // This is simpler, but blocks the UI until the GPU is done.
  // console.log(result.dataSync());
}

runExample();

// TODO: factor out a D3Component superclass

export type GridProps = {
  width: number,
  height: number,
  rows: number,
  cols: number,
  gridCells: Array<Array<number>>
}

type CellContent = number | string;

type GridCell = {
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
  }

  componentDidMount() {
    this.callD3();
  }

  componentDidUpdate() {
    this.callD3();
  }

  private cells_(): Array<GridCell> {
    const cellWidth = this.props.width / this.props.cols;
    const cellHeight = this.props.height / this.props.rows;
    let cells: Array<GridCell> = [];
    for (let i = 0; i < this.props.rows; ++i) {
      for (let j = 0; j < this.props.cols; j++) {
         cells.push({
          x: j * cellWidth,
          y: i * cellHeight,
          width: cellWidth,
          height: cellHeight,
          color: "000",
          content: `(${i}, ${j})`,
        });
      }
    }
    return cells;
  }

  callD3() {
    const gridSvg = this.node;
    const gridCells: Array<GridCell> = this.cells_();

    let cells = d3.select(this.node).selectAll('g')
      .data(gridCells)
      .enter().append('g')
        .attr('class', 'grid-cell')
        .attr('transform', (cell => `translate(${cell.x}, ${cell.y})`))
        .style('text-anchor', 'middle');
    
    let cellBackgrounds = cells.append('rect')
      .attr('class', 'grid-cell-background')
      .attr('width', cell => cell.width)
      .attr('height', cell => cell.height)
      .attr('rx', 20)
      .attr('ry', 20)
      .attr('fill', "green");
    
    cells.filter(cell => typeof cell.content === "string")
      .append('text')
      .attr('x', cell => cell.width / 2)
      .attr('y', cell => cell.height / 2)
      .style('font-family', 'sans-serif')
      .style('font-size', '30px')
      .text(cell => cell.content);
  }

  render() {
    return <svg ref={node => this.node = node}
                width={this.props.width} height={this.props.height}></svg>;
  }
}

export default class Demo extends React.Component {
  render() {
    return (
      <>
        <h1>Hello from Demo!</h1>
        <Grid width={500} height={500} rows={4} cols={3}
              gridCells={[[1, 2], [3, 4]]}/>
      </>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById("app"));
