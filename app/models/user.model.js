

module.exports = (sequelize, Sequelize) =>{
  const User = sequelize.define("user", {

    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
    },
  });
  return User;
};
