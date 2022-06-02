const dateLogic = require("./DateLogicModel");

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
        let weeklyData = [];
        for (let i = 0; i < 7; i++) {
            const targetDate = dateLogic.addDate(start, { days: i });
            const targetData = allData
                .filter((datum) =>
                    dateLogic.isSameDate(datum.start_timestamp, targetDate)
                )
                .map((datum) => {
                    const exam = examDict[datum.exam] || "その他";
                    return { ...datum, exam };
                });
            weeklyData = weeklyData.concat([
                {
                    date: targetDate,
                    displayDate: dateLogic.formatDate(targetDate),
                    data: targetData,
                },
            ]);
        }
        const planDurations = plans.reduce((acc, plan) => {
            const planDuration = dateLogic.intervalToDuration(
                plan.start_timestamp,
                plan.end_timestamp
            );
            if (acc[plan.exam]) {
                return {
                    ...acc,
                    [plan.exam]: dateLogic.addDuration(
                        acc[plan.exam],
                        planDuration
                    ),
                };
            } else {
                return {
                    ...acc,
                    [plan.exam]: planDuration,
                };
            }
        }, {});

        const recordDurations = records.reduce((acc, record) => {
            const recordDuration = dateLogic.intervalToDuration(
                record.start_timestamp,
                record.end_timestamp
            );
            if (acc[record.exam]) {
                return {
                    ...acc,
                    [record.exam]: dateLogic.addDuration(
                        acc[record.exam],
                        recordDuration
                    ),
                };
            } else {
                return {
                    ...acc,
                    [record.exam]: recordDuration,
                };
            }
        }, {});

        const weeklyStatistics = Object.keys({
            ...planDurations,
            ...recordDurations,
        }).map((key) => ({
            examName: examDict[key],
            planDuration: dateLogic.formatDuration(
                planDurations[key] || { minutes: 0 }
            ),
            recordDuration: dateLogic.formatDuration(
                recordDurations[key] || { minutes: 0 }
            ),
        }));
        const rowLength = Math.max(
            ...weeklyData.map((dailyData) => dailyData.data.length)
        );
        const { prev, next } = dateLogic.getPrevNext(start);
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
