const CalendarController = require("./CalendarController");
const ExamController = require("./ExamController");
const PlanController = require("./PlanController");
const RecordController = require("./RecordController");

module.exports = {
    calendarController: new CalendarController(),
    examController: new ExamController(),
    planController: new PlanController(),
    recordController: new RecordController(),
};
