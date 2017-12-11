const update = (state, commands) => {
  const nextState = {};
  const stateKeys = Object.keys(state);
  const commandsKeys = Object.keys(commands);

  switch (commandsKeys[0]) {
    case "$set":
      return Object.assign({}, commands.$set);
    case "$push":
      return state.concat(commands.$push);
    case "$unshift": 
      const unshift = commands.$unshift.reverse();
      return unshift.concat(state); 
    case "$merge":
      return Object.assign({}, state, commands.$merge);
    case "$apply":
      return commands.$apply(state);
    case "$splice": 
      const splice = state.slice();
      splice.splice(...commands.$splice[0]);
      return splice;
    default:
      stateKeys.forEach(key => {
        const originValue = state[key];
        const nextValue = commands[key] && commands[key].$set;

        if (!!nextValue) {
          nextState[key] = nextValue;
          return;
        }

        if (
          typeof commands[key] === "object" &&
          Object.keys(commands[key]).length > 0
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
