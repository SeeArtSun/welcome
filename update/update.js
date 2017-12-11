const update = (state, commands) => {
  const nextState = {};
  const stateKeys = Object.keys(state);

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

return nextState;
};

module.exports = update;
