const uuid = require("uuid");

class RecordLogicModel {
    /**
     * @param {import("./ExamModel")} examModel
     * @param {import("./RecordModel")} recordModel
     */
    constructor(examModel, recordModel) {
        this.examModel = examModel;
        this.recordModel = recordModel;
    }

    /**
     * 試験情報を取得
     * @returns {{exams: Object[]}}
     */
    async getFormData() {
        const exams = await this.examModel.search();
        return {
            exams,
        };
    }

    /**
     * 学習実績情報をDBに登録
     * @param {string} exam
     * @param {string} title
     * @param {string} date
     * @param {string} start
     * @param {string} end
     * @param {string} comment
     * @returns
     */
    async create(exam, title, date, start, end, comment) {
        return this.recordModel.create({
            id: uuid.v4(),
            exam,
            title,
            startTimestamp: new Date(`${date}T${start}`),
            endTimestamp: new Date(`${date}T${end}`),
            comment,
        });
    }
}

module.exports = RecordLogicModel;
