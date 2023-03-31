import Sequelize from "sequelize";
import { sequelizeInstance } from "..";


class Token extends Sequelize.Model {
    static init: any;
}


Token.init(
  {
    value: {
      type: Sequelize.DataTypes.STRING,
      primaryKey: true,
      defaultValue: Sequelize.DataTypes.UUIDV4
    },
    userId: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
    }
  },

  { sequelize: sequelizeInstance, underscored: true, modelName: "token" }
);


export{Token};