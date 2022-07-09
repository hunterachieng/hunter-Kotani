module.exports = (app) =>{
  const users = require("../controllers/user.contoller");
  // eslint-disable-next-line new-cap
  const router = require("express").Router();
  // registration
  router.post("/kyc/user/create", users.register);

  // login
  router.post("/login", users.login);

  // update user info
  router.put("/:id", users.update);

  // delete single user
  router.delete("/:id", users.delete);

  // get one user
  router.get("/:id", users.findOne);

  // get all users
  router.get("/", users.findAll);


  app.use("/api_v2", router);
};
