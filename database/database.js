import { Sequelize } from "sequelize";

//connecction bd mysql
const connection = new Sequelize('perguntas_respostas', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
})
export default connection;