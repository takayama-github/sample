const uuid = require("uuid");

class ExamLogicModel {
    /**
     * @param {import("./ExamModel")} examModel
     */
    constructor(examModel) {
        this.examModel = examModel;
    }

    /**
     * 試験情報をDBに登録
     * @param {{
     *      name: string,
     *      datePlanned: Date,
     *      pointQualified: number,
     *      pointMax: number,
     *      comment: string
     * }} params
     * @returns
     */
    async create({ name, datePlanned, pointQualified, pointMax, comment }) {
        return this.examModel.create({
            id: uuid.v4(),
            name,
            datePlanned,
            pointQualified,
            pointMax,
            comment,
        });
    }
}

module.exports = ExamLogicModel;
