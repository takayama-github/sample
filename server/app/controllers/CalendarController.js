const { dateUtils } = require("../utils");
const { calendarLogic } = require("../models");

class CalendarController {
    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    async getWeekly(req, res) {
        const { query } = req;
        const date =
            typeof query.date === "string" && dateUtils.isValidDate(query.date)
                ? dateUtils.parseDate(query.date)
                : new Date();

        const start = dateUtils.getStartOfWeek(date);
        const end = dateUtils.getEndOfWeek(date);

        const weeklyCalendar = await calendarLogic.getWeeklyCalender(
            start,
            end
        );

        res.render("calendar", {
            ...weeklyCalendar,
            systemName: process.env.SYSTEM_NAME,
            title: "カレンダー",
        });
    }
}

module.exports = CalendarController;
