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
     * 一週間分の学習予定情報と実績情報を集計し、カレンダー画面に表示する
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
        // DBから試験情報を取得する
        const exams = await this.examModel.search();

        // 試験情報データを整形 [id, name] => {id: name}
        /** @type {{[key: string]: string}} */
        const examDict = exams.reduce(
            (dict, exam) => ({
                ...dict,
                [exam.id]: exam.name,
            }),
            {}
        );

        // DBから学習予定情報と実績情報を取得する
        const plans = await this.planModel.search({ start, end });
        const records = await this.recordModel.search({ start, end });

        const allData = plans
            .map((plan) => ({ ...plan, isPlan: true })) // 学習予定情報にタグをつける
            .concat(records) // 予定情報と実績情報を一つの配列にする
            .sort((a, b) => a.start_timestamp - b.start_timestamp); // 開始日時でソート

        // 予定情報と実績情報を日ごとにわける
        const weeklyData = classifyByDay(allData, start, examDict);

        // 予定時間と実績時間を試験ごとに集計する
        const planDurations = plans.reduce(aggregateByExam, {});
        const recordDurations = records.reduce(aggregateByExam, {});

        // 集計した予定時間と実績時間を試験ごとに合わせる
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

        // カレンダー画面に表示する表の行数を算出
        const rowLength = Math.max(
            ...weeklyData.map((dailyData) => dailyData.data.length)
        );

        // 前週、次週へ移動するボタンのパラメータを算出
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
