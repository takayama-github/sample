const { dateLogic, recordLogic } = require("../models");

class RecordController {
    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    async getCreateForm(req, res) {
        const formData = await recordLogic.getFormData();
        res.render("createRecord", {
            ...formData,
            title: process.env.SYSTEM_NAME,
        });
    }

    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    async createRecord(req, res) {
        if (!(await RecordController.isValidRecord(req.body))) {
            res.render("error", { message: "Invalid record!!" });
            return;
        }
        const { exam, title, date, start, end, comment } = req.body;
        await recordLogic.create(exam, title, date, start, end, comment);

        const dateParam = dateLogic.formatDateParam(date);
        const search = new URLSearchParams({ date: dateParam });
        res.redirect(`/?${search.toString()}`);
    }

    static async isValidRecord({ exam, title, date, start, end }) {
        if (
            typeof exam !== "string" ||
            typeof title !== "string" ||
            typeof date !== "string" ||
            typeof start !== "string" ||
            typeof end !== "string"
        ) {
            console.log("not string!!");
            return false;
        }

        if (title === "") {
            console.log("empty title!!");
            return false;
        }

        if (
            !dateLogic.isValidDate(date) ||
            !dateLogic.isValidTime(start) ||
            !dateLogic.isValidTime(end)
        ) {
            console.log("invalid datetime!!");
            return false;
        }

        if (new Date(`${date}T${start}`) >= new Date(`${date}T${end}`)) {
            console.log("start comes after end!!");
            return false;
        }

        return true;
    }
}

module.exports = RecordController;
