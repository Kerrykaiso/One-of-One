module.exports = (sequelize, DataTypes) => {
    const OTP= sequelize.define('OTP', {

      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
      }
   
    });
   
    return OTP;
  };