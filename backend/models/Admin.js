module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define('Admin', {
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
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [["ceo", "sales", "manager"]]
        }
      },
    });
  
    return Admin;
  };