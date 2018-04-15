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
  constructor(private policy: Policy<number, boolean>) { }
  act(observation: number): boolean {
    return false;
  }
}
