const { formatDateParam, isValidDate, isValidTime } = require("../utils");
const { planLogic } = require("../models");

class PlanController {
    /**
     * 学習予定情報の登録フォームを表示する
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    async getCreateForm(req, res) {
        const formData = await planLogic.getFormData();
        res.render("createPlan", {
            ...formData,
            systemName: process.env.SYSTEM_NAME,
            title: "学習予定登録",
        });
    }

    /**
     * 学習予定情報を登録し、カレンダー画面へリダイレクトする
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    async createPlan(req, res) {
        if (!(await PlanController.isValidPlan(req.body))) {
            res.render("error", { message: "Invalid plan!!" });
            return;
        }
        const { exam, title, date, start, end, comment } = req.body;

        await planLogic.create(exam, title, date, start, end, comment);

        const dateParam = formatDateParam(date);
        const search = new URLSearchParams({ date: dateParam });
        res.redirect(`/?${search.toString()}`);
    }

    /**
     * フォームから送信されてきたデータのバリデーションを行う
     * @param {{[key: string]: string}} param0
     * @returns
     */
    static async isValidPlan({ exam, title, date, start, end }) {
        if (
            typeof exam !== "string" ||
            typeof title !== "string" ||
            typeof date !== "string" ||
            typeof start !== "string" ||
            typeof end !== "string"
        ) {
            console.error("not string!!");
            return false;
        }

        if (title === "") {
            console.error("empty title!!");
            return false;
        }

        if (!isValidDate(date) || !isValidTime(start) || !isValidTime(end)) {
            console.error("invalid datetime!!");
            return false;
        }

        if (new Date(`${date}T${start}`) >= new Date(`${date}T${end}`)) {
            console.error("start comes after end!!");
            return false;
        }

        return true;
    }
}

module.exports = PlanController;
