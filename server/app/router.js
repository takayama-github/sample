const express = require("express");

const {
    calendarController,
    examController,
    planController,
    recordController,
} = require("./controllers");

const router = express.Router();
router.get("/", calendarController.getWeekly);
router.get("/registerExam", examController.getCreateForm);
router.post("/registerExam", examController.createExam);
router.get("/createPlan", planController.getCreateForm);
router.post("/createPlan", planController.createPlan);
router.get("/createRecord", recordController.getCreateForm);
router.post("/createRecord", recordController.createRecord);

module.exports = router;
