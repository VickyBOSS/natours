const router = require("express").Router();
const tourController = require("./../controllers/tourControllers");

router.post("/", tourController.createTour);

router.get("/", tourController.getTours);

router.get("/:id", tourController.getTour);

router.patch("/:id", tourController.updateTour);

router.delete("/:id", tourController.deleteTour);

module.exports = router;
