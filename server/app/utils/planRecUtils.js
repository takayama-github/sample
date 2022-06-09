const { addDate,
    isSameDate,
    formatDate,
    getDuration,
    addDuration
} = require("./dateUtils");

/**
 * 日付ごとにデータをまとめる
 * @param {Object[]} data
 * @param {Date} start
 * @param {Object.<string, string>} examDict
 * @returns {{
 *     date: Date,
 *     displayDate: string,
 *     data: Object[],
 * }[]
 *  }
 */
function classifyByDay(data, start, examDict) {
    let weeklyData = [];
    for (let i = 0; i < 7; i++) {
        const targetDate = addDate(start, { days: i });
        const targetData = data
            .filter((datum) =>
                isSameDate(datum.start_timestamp, targetDate)
            )
            .map((datum) => {
                const exam = examDict[datum.exam];
                return { ...datum, exam };
            });
        weeklyData = weeklyData.concat([
            {
                date: targetDate,
                displayDate: formatDate(targetDate),
                data: targetData,
            },
        ]);
    }

    return weeklyData;
}

/**
 * 試験ごとに時間を集計する
 * for Array.prototype.reduce
 * see https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
 * @param {{}} acc
 * @param {Object} data
 * @returns {{
 *     [key: string]: Object
 * }}
 */
function aggregateByExam(acc, data) {
    const dataDuration = getDuration(
        data.start_timestamp,
        data.end_timestamp
    );
    if (acc[data.exam]) {
        return {
            ...acc,
            [data.exam]: addDuration(
                acc[data.exam],
                dataDuration
            ),
        };
    } else {
        return {
            ...acc,
            [data.exam]: dataDuration,
        };
    }
}

module.exports = {
    classifyByDay,
    aggregateByExam
};
