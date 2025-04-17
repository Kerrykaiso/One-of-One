module.exports = (sequelize, DataTypes) => {
    const Testing= sequelize.define('Testing', {

      number: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
    
   
   
    });
   
    return Testing;
  };