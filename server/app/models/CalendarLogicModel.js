const {
    formatDurationJa,
    getPrevNext,
    classifyByDay,
    aggregateByExam,
} = require("../utils");

class CalendarLogicModel {
    /**
     *
     * @param {import("./ExamModel")} examModel
     * @param {import("./PlanModel")} planModel
     * @param {import("./RecordModel")} recordModel
     */
    constructor(examModel, planModel, recordModel) {
        this.examModel = examModel;
        this.planModel = planModel;
        this.recordModel = recordModel;
    }

    /**
     * @param {string} start
     * @param {string} end
     * @returns {{
     *      weeklyData: {
     *          date: Date,
     *          displayDate: string,
     *          data: Object[],
     *      }[],
     *      weeklyStatistics: {
     *          examName: string,
     *          planDuration: string,
     *          recordDuration: string
     *      }[],
     *      rowLength: number,
     *      prev: string,
     *      next: string,
     *  }}
     */
    async getWeeklyCalender(start, end) {
        const exams = await this.examModel.search();
        /** @type {Object.<string, string>} */
        const examDict = exams.reduce(
            (dict, exam) => ({
                ...dict,
                [exam.id]: exam.name,
            }),
            {}
        );

        const plans = await this.planModel.search({ start, end });
        const records = await this.recordModel.search({ start, end });

        const allData = plans
            .map((plan) => ({ ...plan, isPlan: true }))
            .concat(records)
            .sort((a, b) => a.start_timestamp - b.start_timestamp);

        const weeklyData = classifyByDay(allData, start, examDict);

        const planDurations = plans.reduce(aggregateByExam, {});
        const recordDurations = records.reduce(aggregateByExam, {});

        const weeklyStatistics = Object.keys({
            ...planDurations,
            ...recordDurations,
        }).map((key) => ({
            examName: examDict[key],
            planDuration: formatDurationJa(
                planDurations[key] || { minutes: 0 }
            ),
            recordDuration: formatDurationJa(
                recordDurations[key] || { minutes: 0 }
            ),
        }));
        const rowLength = Math.max(
            ...weeklyData.map((dailyData) => dailyData.data.length)
        );
        const { prev, next } = getPrevNext(start);
        return {
            weeklyData,
            weeklyStatistics,
            rowLength,
            prev,
            next,
        };
    }
}

module.exports = CalendarLogicModel;
