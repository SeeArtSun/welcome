const update = (state, commands) => {
  const nextState = {};
  const stateKeys = Object.keys(state);

  stateKeys.forEach(key => {
    nextState[key] = (commands[key] && commands[key].$set) || state[key];
  });

  return nextState;
};

module.exports = update;
