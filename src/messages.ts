import * as rl from './rl';

export interface Message {
  type: string,
}

export interface StateUpdate extends Message {
  type: 'state-update',
  gridWorldState: rl.GridWorldState,
}

export interface Step extends Message {
  type: 'step'
}