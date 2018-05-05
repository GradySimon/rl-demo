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

export function log(message: Message) {
  console.log(`Recieved message of type ${message.type}:` + '\n' +
    JSON.stringify(message, null, 2));
}