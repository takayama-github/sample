const { dateUtils } = require("../utils");

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
            const targetDate = dateUtils.addDate(start, { days: i });
            const targetData = allData
                .filter((datum) =>
                    dateUtils.isSameDate(datum.start_timestamp, targetDate)
                )
                .map((datum) => {
                    const exam = examDict[datum.exam] || "その他";
                    return { ...datum, exam };
                });
            weeklyData = weeklyData.concat([
                {
                    date: targetDate,
                    displayDate: dateUtils.formatDate(targetDate),
                    data: targetData,
                },
            ]);
        }
        const planDurations = plans.reduce((acc, plan) => {
            const planDuration = dateUtils.getDuration(
                plan.start_timestamp,
                plan.end_timestamp
            );
            if (acc[plan.exam]) {
                return {
                    ...acc,
                    [plan.exam]: dateUtils.addDuration(
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
            const recordDuration = dateUtils.getDuration(
                record.start_timestamp,
                record.end_timestamp
            );
            if (acc[record.exam]) {
                return {
                    ...acc,
                    [record.exam]: dateUtils.addDuration(
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
            planDuration: dateUtils.formatDurationJa(
                planDurations[key] || { minutes: 0 }
            ),
            recordDuration: dateUtils.formatDurationJa(
                recordDurations[key] || { minutes: 0 }
            ),
        }));
        const rowLength = Math.max(
            ...weeklyData.map((dailyData) => dailyData.data.length)
        );
        const { prev, next } = dateUtils.getPrevNext(start);
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
