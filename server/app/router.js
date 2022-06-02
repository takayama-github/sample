const express = require("express");

const {
    calendarController,
    planController,
    recordController,
} = require("./controllers");

const router = express.Router();
router.get("/", calendarController.getWeekly);
router.get("/createPlan", planController.getCreateForm);
router.post("/createPlan", planController.createPlan);
router.get("/createRecord", recordController.getCreateForm);
router.post("/createRecord", recordController.createRecord);

module.exports = router;
