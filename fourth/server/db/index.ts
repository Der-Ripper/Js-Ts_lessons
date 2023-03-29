import { Sequelize } from "sequelize";


const sequelizeInstance = new Sequelize({
  dialect: "sqlite",
  storage: "./sqliteData/database.sqlite",
});

const initDB = async () => {
  try {
    await sequelizeInstance.authenticate();
    await sequelizeInstance.sync();
    console.log("Sequelize was initialized");
  } catch (error: any) {
    console.log("Sequelize ERROR (initDB)", error);
    process.exit();
  }
};


export {
    sequelizeInstance,
    initDB
};