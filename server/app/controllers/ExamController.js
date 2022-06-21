const { isValidDate } = require("../utils");
const { examLogic } = require("../models");

class ExamController {
    /**
     * 試験情報登録フォームを表示する
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    async getCreateForm(req, res) {
        res.render("registerExam", {
            systemName: process.env.SYSTEM_NAME,
            title: "試験情報登録",
        });
    }

    /**
     * 試験情報を登録し、カレンダー画面へリダイレクトする
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    async createExam(req, res) {
        if (!(await ExamController.isValidExam(req.body))) {
            res.render("error", { message: "Invalid exam!!" });
            return;
        }
        const { name, datePlanned, pointQualified, pointMax, comment } =
            req.body;

        await examLogic.create({
            name,
            datePlanned: datePlanned
                ? new Date(`${datePlanned}T00:00:00`)
                : undefined,
            pointQualified: Number(pointQualified) || undefined,
            pointMax: Number(pointMax) || undefined,
            comment: comment || undefined,
        });

        res.redirect(`/`);
    }

    /**
     * フォームから送信されてきたデータのバリデーションを行う
     * @param {{[key: string]: string}} param0
     * @returns
     */
    static async isValidExam({
        name,
        datePlanned,
        pointQualified,
        pointMax,
        comment,
    }) {
        if (typeof name !== "string" || name === "") {
            console.error("not string!!");
            return false;
        }

        if (
            datePlanned &&
            (typeof datePlanned !== "string" || !isValidDate(datePlanned))
        ) {
            console.error("invalid planned date!!");
            return false;
        }

        if (
            pointQualified &&
            (typeof pointQualified !== "string" ||
                !/^\d+$/.test(pointQualified))
        ) {
            console.error("invalid qualified point!!");
            return false;
        }

        if (
            pointMax &&
            (typeof pointMax !== "string" || !/^\d+$/.test(pointMax))
        ) {
            console.error("invalid max point!!");
            return false;
        }

        if (comment && typeof comment !== "string") {
            console.error("invalid comment!!");
            return false;
        }

        return true;
    }
}

module.exports = ExamController;
