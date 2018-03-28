import * as dl from 'deeplearn';
import * as d3 from 'd3';
import * as React from "react";
import * as ReactDOM from "react-dom";

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
  act(obersvation: ObservationT): ActionT
}

interface ActionDistribution<ActionT> {
  (action: ActionT): number 
}

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
  rows: number,
  cols: number,
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

  callD3() {
    const node = this.node;
    d3.select(node)
      .selectAll('circle')
      .data([this.props.rows, this.props.cols])
      .enter()
      .append('circle')
        .attr("cx", d => d * 40)
        .attr("cy", d => d * 40)
        .attr("r", d => 20);
  }

  render() {
    return <svg ref={node => this.node = node}
                width={500} height={500}></svg>;
  }
}

export default class Demo extends React.Component {
  render() {
    return (
      <>
        <h1>Hello from Demo!</h1>
        <Grid rows={1} cols={2} />
      </>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById("app"));
