const uuid = require("uuid");

class PlanLogicModel {
    /**
     * @param {import("./ExamModel")} examModel
     * @param {import("./PlanModel")} planModel
     */
    constructor(examModel, planModel) {
        this.examModel = examModel;
        this.planModel = planModel;
    }

    /**
     *
     * @returns {{exams: Object[]}}
     */
    async getFormData() {
        const exams = await this.examModel.search();
        return {
            exams,
        };
    }

    /**
     * @param {string} exam
     * @param {string} title
     * @param {string} date
     * @param {string} start
     * @param {string} end
     * @param {string} comment
     * @returns
     */
    async create(exam, title, date, start, end, comment) {
        return this.planModel.create({
            id: uuid.v4(),
            exam,
            title,
            startTimestamp: new Date(`${date}T${start}`),
            endTimestamp: new Date(`${date}T${end}`),
            comment,
        });
    }
}

module.exports = PlanLogicModel;
