const router = require("express").Router();
const { createUser } = require("./../controllers/userControllers");

router.post("/create", createUser);

module.exports = router;
