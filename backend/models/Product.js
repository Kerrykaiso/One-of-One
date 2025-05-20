module.exports = (sequelize, DataTypes) => {
    const Product= sequelize.define('Product', {
        id:{
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            unique: true
          },
      color: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      material: {
        type: DataTypes.STRING,
        defaultValue:"cotton",
        allowNull: false,
      },
     designerEmail:{
        type: DataTypes.STRING,
        allowNull: false
     },
    designer:{
        type: DataTypes.STRING,
        allowNull: false
    },
    owner:{
        type: DataTypes.STRING,
        allowNull: true  
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull:false
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false 
    },
    description:{
        type: DataTypes.STRING, 
        allowNull: false 
    },
    size:{
        type: DataTypes.STRING,
        allowNull: false
    },
    status:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:"available",
        validate:{
            isIn:[["sold","processing","available"]]
        } 
    },
    productImage:{
         type: DataTypes.STRING,
         allowNull:false
    },
    category:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [[ "Design", "Painted"]]
        }, 
    }
    });
   Product.associate =(models)=>{
    Product.belongsTo(models.Designer,{
        foreignKey:"designer_id",
        as: "Designer"
    })
   }
    return Product;
  };