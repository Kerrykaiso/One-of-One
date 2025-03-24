const { TimeSeriesBucketTimestamp } = require("redis");
const OTP=require("./otp")

module.exports = (sequelize, DataTypes) => {
    const Designer = sequelize.define('Designer', {
      id:{
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
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
        allowNull: false,
        defaultValue: false
      },
      role:{
        type: DataTypes.STRING,
        defaultValue: "Designer"
      },
      X:{
        type: DataTypes.STRING,
        allowNull: true
      },
      pinterest:{
        type: DataTypes.STRING,
        allowNull: true
      },
      instagram: {
        type: DataTypes.STRING,
        allowNull: true
      }
    });
   
    return Designer;
  };
