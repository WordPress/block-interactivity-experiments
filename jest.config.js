module.exports = {
  transform: {
    "^.+\\.jsx?$": ["babel-jest", { configFile: "./jest.babel.config.js" }],
  },
};
