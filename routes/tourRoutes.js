const router = require('express').Router();
const tourController = require('./../controllers/tourControllers');

router
  .route('/top-5-cheap')
  .get(tourController.top5CheapAlias, tourController.getTours);

router.route('/tours-stats').get(tourController.getToursStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router.route('/').post(tourController.createTour).get(tourController.getTours);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
