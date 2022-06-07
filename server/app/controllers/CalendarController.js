const { dateLogic, calendarLogic } = require("../models");

class CalendarController {
    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    async getWeekly(req, res) {
        const { query } = req;
        const date =
            typeof query.date === "string" && dateLogic.isValidDate(query.date)
                ? dateLogic.parseDate(query.date)
                : new Date();

        const start = dateLogic.getStartOfWeek(date);
        const end = dateLogic.getEndOfWeek(date);

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
