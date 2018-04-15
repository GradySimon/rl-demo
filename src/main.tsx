import * as d3 from 'd3';
import * as React from "react";
import * as ReactDOM from "react-dom";
import { join } from 'path';

import * as workerPath from "file-loader?name=[name].js!./demo.worker";

const worker = new Worker(workerPath);

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
      .attr('fill', "pink");
    
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
