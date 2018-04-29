import * as rl from '../rl';
import * as messages from '../messages';

console.log('hi! ' + rl.GridDirection.South);

const gridWorld: rl.GridWorld = new rl.GridWorld(4, 4);
const agent: rl.ExampleAgent = new rl.ExampleAgent;

let currentState: rl.GridWorldState = {agentCoords: [1, 1], final: false};

function step(state: rl.GridWorldState): rl.GridWorldState {
  const action = agent.act(state.agentCoords);
  const [nextState, reward] = gridWorld.step(state, action);
  return nextState;
}

function logMessage(message: messages.Message) {
  console.log(`Recieved message of type ${message.type}:` + '\n' + 
              JSON.stringify(message));
}

onmessage = function(event: MessageEvent) {
  const message = <messages.Message>event.data;
  logMessage(message);
  switch (message.type) {
    case 'step':
      currentState = step(currentState);
      postMessage(
        <messages.StateUpdate>{
          type: 'state-update',
          gridWorldState: currentState
        });
      break;
    default:
      break;
  }
}