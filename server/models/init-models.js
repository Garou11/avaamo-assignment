var DataTypes = require("sequelize").DataTypes;
var _user_documents = require("./user_documents");

function initModels(sequelize) {
  var user_documents = _user_documents(sequelize, DataTypes);


  return {
    user_documents,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
