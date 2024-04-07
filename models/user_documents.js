const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_documents', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    docid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "user_documents_un"
    },
    isactive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "user_documents_un"
    }
  }, {
    sequelize,
    tableName: 'user_documents',
    schema: 'docs',
    timestamps: false,
    indexes: [
      {
        name: "user_documents_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "user_documents_un",
        unique: true,
        fields: [
          { name: "userid" },
          { name: "filename" },
        ]
      },
    ]
  });
};
