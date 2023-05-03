import Sequelize from "sequelize";
import { sequelizeInstance } from "..";


class User extends Sequelize.Model {
    static init: any;
}


User.init(
  {
    id: {
      type: Sequelize.DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.DataTypes.UUIDV4
    },
    firstName: {
      type: Sequelize.STRING,
      defaultValue: "firstName"
    },
    lastName: {
      type: Sequelize.STRING,
      defaultValue: "lastName"
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        defaultValue: "email"
    },
    password: {
        type: Sequelize.STRING,
        defaultValue: "password"
    },
    isDone: { 
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
  },

  { sequelize: sequelizeInstance, underscored: true, modelName: "user" }
);


export{User};