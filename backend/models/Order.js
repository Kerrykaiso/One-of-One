const {v4: uuidv4}= require("uuid")

module.exports = (sequelize, DataTypes) => {
    const Order= sequelize.define('Order', {
        id:{
            type: DataTypes.UUID,
            defaultValue:()=>uuidv4(),
            primaryKey: true,
            allowNull: false,
            unique: true
          },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      owner:{
        type:DataTypes.STRING,
        allowNull: false
      },
      paymentRef: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
     number:{
        type: DataTypes.INTEGER,
        allowNull: false,
     },
     productId:{
      type: DataTypes.STRING,
      allowNull: false,
     },
     designerId:{
      type: DataTypes.STRING,
      allowNull: false,
     },
     amount:{
      type: DataTypes.INTEGER,
      allowNull: false,
   },


    });
   
    return Order;
  };