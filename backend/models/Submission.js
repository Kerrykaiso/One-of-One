module.exports = (sequelize, DataTypes) => {
    const Submission= sequelize.define('Submission', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      designerId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      designerName:{
        type: DataTypes.STRING,
        allowNull: false
      },
      designerEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:"pending",
        validate: {
            isIn: [["pending", "accepted", "rejected"]]
        }
      },
      mockupURLs:{
        type: DataTypes.TEXT,
        allowNull: false
      },

     designsURLs:{
      type: DataTypes.TEXT,
      allowNull: false 
     },
     designName:{
      type: DataTypes.STRING
     },
     price:{
      type: DataTypes.INTEGER,
      allowNull:false

     },
     designerTier:{
      type: DataTypes.STRING
     },
     category:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          isIn: [[ "Design", "Painted"]]
      },
     }
    },
    {
      afterFind: (result)=>{
        if (result) {
          result.mockupURLs = JSON.parse(result.mockupURLs)
          result.designsURLs = JSON.parse(result.designsURLs)
        }
      }
    }
   );
   
    return Submission;
  };