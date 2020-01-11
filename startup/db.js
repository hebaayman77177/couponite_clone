const mongoose = require("mongoose");
const config = require("config");
const Fawn = require("fawn");

module.exports = function() {
  /*data base connection logic */
  // mongoose.connect(config.get('mongodb.host'), config.get('mongodb.settings')).then(()=>{
  //     console.log('database connected');
  // }).
  // catch(err=>{
  //     console.log(err);
  // });

  mongoose
    .connect(
      "mongodb+srv://hebaayman77177:Heba@01272677303@cccluster-oegv2.mongodb.net/test?retryWrites=true&w=majority",
      { useNewUrlParser: true }
    )
    .then(() => {
      console.log("database connected");
    })
    .catch(err => {
      console.log(err);
    });
  Fawn.init(mongoose);
};
