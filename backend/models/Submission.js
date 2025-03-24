module.exports = (sequelize, DataTypes) => {
    const Submission= sequelize.define('Submission', {

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

    },
   );
   
    return Submission;
  };