import Sequelize from "sequelize";
import { sequelizeInstance } from "..";


class ToDo extends Sequelize.Model {
    static init: any;
}


ToDo.init(
  {
    id: {
      type: Sequelize.DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    title: {
      type: Sequelize.STRING,
      defaultValue: "Title",
    },
    description: {
      type: Sequelize.STRING,
      defaultValue: "Description",
    },
    userId: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    date: {
      type: Sequelize.DataTypes.DATE
    },
    isDone: { 
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },

  { sequelize: sequelizeInstance, underscored: true, modelName: "todo" }
);


export{ToDo};