const {
    startOfWeek,
    format,
    add,
    isValid,
    endOfDay,
    startOfDay,
    previousMonday,
    nextMonday,
    intervalToDuration,
    formatDuration,
    milliseconds,
    parse,
} = require("date-fns");
const { ja } = require("date-fns/locale");

/**
 * @typedef {Object} Duration
 * @property {number} years
 * @property {number} months
 * @property {number}weeks
 * @property {number} days
 * @property {number} hours
 * @property {number} minutes
 * @property {number} seconds
 */

/**
 * 週の始まり日時を月曜始まりで取得する
 * @param {number | Date} date
 * @returns {Date}
 */
function getStartOfWeek(date) {
    return startOfWeek(date, { weekStartsOn: 1 });
}

/**
 * 週の終わり日時を月曜始まりで取得する
 * @param {number | Date} date
 * @returns {Date}
 */
function getEndOfWeek(date) {
    const start = getStartOfWeek(date);
    return endOfDay(add(start, { days: 6 }));
}

/**
 * 日付に加算する
 * @param {number | Date} date
 * @param {Duration} duration
 * @returns {Date}
 */
function addDate(date, duration) {
    return add(date, duration);
}

/**
 * 日付を表示用文字列にフォーマットする
 * @param {number | Date} date
 * @returns {string}
 */
function formatDate(date) {
    return format(date, "yyyy/MM/dd (EE)");
}

/**
 * 同じ日付であるかチェックする
 * @param {number | Date} date1
 * @param {number | Date} date2
 * @returns {boolean}
 */
function isSameDate(date1, date2) {
    return startOfDay(date1).getTime() === startOfDay(date2).getTime();
}

/**
 * yyyyMMddをyyyy-MM-ddにする
 * @param {string} date
 * @returns {string}
 */
function formatDateString(date) {
    return `${date.substring(0, 4)}-${date.substring(
        4,
        6
    )}-${date.substring(6)}`;
}

/**
 * yyyy-MM-ddをyyyyMMddにする
 * @param {string} date
 * @returns {string}
 */
function formatDateParam(date) {
    return `${date.substring(0, 4)}${date.substring(5, 7)}${date.substring(
        8
    )}`;
}

/**
 * yyyyMMddを日付型にparseする
 * @param {string} date
 * @returns {Date}
 */
function parseDate(date) {
    return parse(date, "yyyyMMdd", new Date());
}

/**
 * 前週と来週の月曜日の文字列（yyyyMMdd）を取得する
 * @param {number | Date} date
 * @returns {{prev: string, next: string}}
 */
function getPrevNext(date) {
    return {
        prev: format(previousMonday(date), "yyyyMMdd"),
        next: format(nextMonday(date), "yyyyMMdd"),
    };
}


/**
 * @param {number | Date} start
 * @param {number | Date} end
 * @return {Duration}
 */
function getDuration(start, end) {
    return intervalToDuration({start,end});
}

/**
 * durationを加算する
 * @param {Duration} duration1
 * @param {Duration} duration2
 */
function addDuration(duration1, duration2) {
    return getDuration(
        0,
        milliseconds(duration1) + milliseconds(duration2)
    );
}

/**
 * durationをフォーマットする
 * @param {Duration} duration
 * @returns {string}
 */
function formatDurationJa(duration) {
    return formatDuration(duration, { locale: ja });
}

/**
 * 文字列が正当なyyyyMMdd or yyyy-MM-ddになっているかチェックする
 * @param {string} date
 * @returns {boolean}
 */
function isValidDate(date) {
    if (/^\d{8}$/.test(date)) {
        return isValid(new Date(formatDateString(date)));
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return isValid(new Date(date));
    }

    return false;
}

/**
 * 文字列が正当なHH:mm:ssになっているかチェックする
 * @param {string} time
 * @returns {boolean}
 */
function isValidTime(time) {
    return (
        /^\d{2}:\d{2}:\d{2}$/.test(time) &&
        isValid(parse(time, "HH:mm:ss", new Date()))
    );
}

module.exports = {
    getStartOfWeek,
    getEndOfWeek,
    addDate,
    formatDate,
    isSameDate,
    formatDateString,
    formatDateParam,
    parseDate,
    getPrevNext,
    getDuration,
    addDuration,
    formatDurationJa,
    isValidDate,
    isValidTime,
};
