module.exports = (sequelize, DataTypes) => {
    const Stock= sequelize.define('Stock', {

      color: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      material: {
        type: DataTypes.STRING,
        allowNull: false,
      },
   
    number:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
    });
   
    return Stock;
  };