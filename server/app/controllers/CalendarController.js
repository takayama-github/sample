const {
    isValidDate,
    parseDate,
    getStartOfWeek,
    getEndOfWeek,
} = require("../utils");
const { calendarLogic } = require("../models");

class CalendarController {
    /**
     * 一週間分のデータを取得し、カレンダー画面に表示する
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    async getWeekly(req, res) {
        const { query } = req;
        const date =
            typeof query.date === "string" && isValidDate(query.date)
                ? parseDate(query.date)
                : new Date();

        const start = getStartOfWeek(date);
        const end = getEndOfWeek(date);

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
