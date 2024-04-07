const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || 'development';

const config = require("../config/credentials.json")[env];
const avaamoModels = require("./init-models");

const sequelizeCon = new Sequelize(
	config.database.avaamo.dbname,
	config.database.avaamo.username,
	config.database.avaamo.password,
	{
		host: config.database.avaamo.host,
		port: config.database.avaamo.port,
		dialect: "postgres",
		schema: "docs",
		define: {
			freezeTableName: true,
		},
	}
);

const { user_documents } = avaamoModels(sequelizeCon);
module.exports= {
	user_documents
}

