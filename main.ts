import * as dl from 'deeplearn';

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
  console.log(await result.data());  // Float32Array([3, 4, 5])

  // Option 2: With a Promise.
  result.data().then(data => console.log(data));

  // Option 3: Synchronous download of data.
  // This is simpler, but blocks the UI until the GPU is done.
  console.log(result.dataSync());
}

runExample();
