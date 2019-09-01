const log = (...args) => {
  console.log("[".grey + "Server".bold.yellow + "]".grey, ...args);
};

export default log;
