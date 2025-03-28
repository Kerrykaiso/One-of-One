const {v4: uuidv4}= require("uuid")

module.exports=(sequelize, DataTypes)=>{

    const Wallet=sequelize.define("Wallet",{
     
      id:{
        type: DataTypes.UUID,
         defaultValue: ()=>uuidv4(),
         primaryKey: true,
         allowNull: false
      },
       designerId:{
        allowNull: false,
        type: DataTypes.STRING
      },
    
      balance:{
        type: DataTypes.DECIMAL(30,2),
        defaultValue: 0.00,
        allowNull:false
      },
      
      status:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue: "Active"
      }

    
    })
    return Wallet
   }
   