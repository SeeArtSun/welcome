const update = (state, commands) => {
  const nextState = {};
  const stateKeys = Object.keys(state);
  const commandsKeys = Object.keys(commands);

  switch (commandsKeys[0]) {
    case "$push":
      return state.concat(commands.$push);
    default:
      stateKeys.forEach(key => {
        const originValue = state[key];
        const nextValue = commands[key] && commands[key].$set;
          
        if(!!commands.$set) {
          return Object.assign(nextState, commands.$set);
        }

        if (!!nextValue) {
          nextState[key] = nextValue;
          return;
        }

        if (
          typeof originValue === "object" &&
          Object.keys(originValue).length > 0
        ) {
          nextState[key] = update(originValue, commands[key]);
        } else {
          nextState[key] = originValue;
        }
      });
    break;
  }

  return nextState;
};

module.exports = update;
