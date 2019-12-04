module.exports = function() {
  /**
   * handling uncaught exceptions
   *  rejected promises etc ..
   */
  process.addListener("uncaughtException", err => {
    console.log("error occured", err);
  });
};
