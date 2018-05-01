const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const roomSchema = Schema({
    name:  String,
    desc:  String,
    owner: Schema.Types.ObjectId
  });

  const Room = mongoose.model("Room", roomSchema);

  module.exports = Room;