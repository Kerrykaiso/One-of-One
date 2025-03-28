module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define('Customer', {
      id:{
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isverified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      role:{
        type: DataTypes.STRING,
        defaultValue: "Customer"
      }
    });
  
    return Customer;
  };