const CalendarController = require("./CalendarController");
const PlanController = require("./PlanController");
const RecordController = require("./RecordController");

module.exports = {
    calendarController: new CalendarController(),
    planController: new PlanController(),
    recordController: new RecordController(),
};
