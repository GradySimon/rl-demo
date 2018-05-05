function clip(lowerBound: number, upperBound: number, value: number): number {
  return Math.min(upperBound, Math.max(lowerBound, value));
}

export interface World<StateT, ActionT> {
  /**
   * 
   * @param state State to step forward from
   * @param action Action taken by agent from state
   * @returns a tuple of the next state and the reward the agent gets for
   * exiting the first state
   */
  step(state: StateT, action: ActionT): [StateT, number]
}

export const enum GridDirection {
  North,
  East,
  South,
  West
}

const gridDirectionDelta = {
  [GridDirection.North]: [-1, 0],
  [GridDirection.East]: [0, 1],
  [GridDirection.South]: [1, 0],
  [GridDirection.West]: [0, -1],
}

export type GridCoords = [number, number];

export type Reward = number;

export type GridWorldState = {
  agentCoords: GridCoords,
  final: boolean,
}

export class GridWorld implements World<GridWorldState, GridDirection> {
  constructor(public readonly rows, public readonly cols) {
  }

  coordsInDirection_([startRow, startCol]: GridCoords, direction: GridDirection): GridCoords {
    let [deltaRows, deltaCols] = gridDirectionDelta[direction];
    return [
      clip(0, this.rows, startRow + deltaRows),
      clip(0, this.cols, startCol + deltaCols)
    ];
  }

  step(state: GridWorldState, action: GridDirection): [GridWorldState, Reward] {
    if (state.agentCoords === [0, 0]) {
      return [{agentCoords: state.agentCoords, final: true}, 0]
    } else {
      const nextCoords = this.coordsInDirection_(state.agentCoords, action);
      return [{agentCoords: nextCoords, final: false}, -1];
    }
  }
}


/** 
 * Something that can select actions in the face of observations.
 */
export interface Agent<ObservationT, ActionT> {
  /**
   * Choose and return a concrete action based on the given observation
   * @param obersvation the observation to act upon
   */
  act(observation: ObservationT): ActionT
}

// Maybe action distributions should live in tensorflow, not here
export interface ActionDistribution<ActionT> {
  (action: ActionT): number
}

// Interface for thing that can be trained by reinforcement learning?

export interface Policy<ObservationT, ActionT> {
  (observation: ObservationT): ActionDistribution<ActionT>
}

export class ExampleAgent implements Agent<GridCoords, GridDirection> {
  constructor() { }
  act(observation: GridCoords): GridDirection {
    return GridDirection.North;
  }
}

export interface Environment<WorldT, AgentT> {
  step(world: WorldT, agent: AgentT): [WorldT, AgentT]
}

// class GridWorldController implements Environment<GridWorld, 
