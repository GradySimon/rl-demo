import * as rl from '../rl';
import * as messages from '../messages';

const gridWorld: rl.GridWorld = new rl.GridWorld(4, 4);
const agent: rl.ExampleAgent = new rl.ExampleAgent;

let currentState: rl.GridWorldState = {agentCoords: [3, 3], final: false};

function step(state: rl.GridWorldState): rl.GridWorldState {
  const action = agent.act(state.agentCoords);
  const [nextState, reward] = gridWorld.step(state, action);
  return nextState;
}

onmessage = function(event: MessageEvent) {
  const message = <messages.Message>event.data;
  messages.log(message);
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