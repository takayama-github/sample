const express = require("express");
const {
    endOfDay,
    startOfWeek,
    add,
    isValid,
    parse,
    startOfDay,
    format,
    intervalToDuration,
    previousMonday,
    nextMonday,
    milliseconds,
    formatDuration,
} = require("date-fns");
const { ja } = require("date-fns/locale");
const { Client } = require("pg");

const router = express.Router();
router.get("/", async (req, res) => {
    const { query } = req;
    const date =
        typeof query.date === "string" &&
        /^\d{8}$/.test(query.date) &&
        isValid(
            new Date(
                `${query.date.substring(0, 4)}-${query.date.substring(
                    4,
                    6
                )}-${query.date.substring(6)}`
            )
        )
            ? parse(query.date, "yyyyMMdd", new Date())
            : new Date();

    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfDay(add(start, { days: 6 }));

    // <CalendarLogicModel>
    const client = new Client({
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOSTNAME,
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: process.env.POSTGRES_PORT,
    });
    client.connect();

    // <ExamModel>
    const exams = await client.query({
        text: `SELECT id, name, date_planned, date_exam, point_qualified, point_gained, point_max, comment FROM exams`,
    });
    /** @type {Object.<string, string>} */
    const examDict = exams.rows.reduce(
        (dict, exam) => ({
            ...dict,
            [exam.id]: exam.name,
        }),
        {}
    );
    // </ExamModel>

    // <PlanModel>
    const plansRes = await client.query({
        text: `SELECT id, exam, title, start_timestamp, end_timestamp, comment FROM plans
                WHERE start_timestamp >= $1 and end_timestamp <= $2 ORDER BY start_timestamp`,
        values: [start, end],
    });
    const plans = plansRes.rows;
    // </PlanModel>

    // <RecordModel>
    const recordsRes = await client.query({
        text: `SELECT id, exam, title, start_timestamp, end_timestamp, comment FROM records
                WHERE start_timestamp >= $1 and end_timestamp <= $2 ORDER BY start_timestamp`,
        values: [start, end],
    });
    const records = recordsRes.rows;
    // </RecordModel>

    const allData = plans
        .map((plan) => ({ ...plan, isPlan: true }))
        .concat(records)
        .sort((a, b) => a.start_timestamp - b.start_timestamp);
    let weeklyData = [];
    for (let i = 0; i < 7; i++) {
        const targetDate = add(start, { days: i });
        const targetData = allData
            .filter(
                (datum) =>
                    startOfDay(datum.start_timestamp).getTime() ===
                    startOfDay(targetDate).getTime()
            )
            .map((datum) => {
                const exam = examDict[datum.exam] || "その他";
                return { ...datum, exam };
            });
        weeklyData = weeklyData.concat([
            {
                date: targetDate,
                displayDate: format(targetDate, "yyyy/MM/dd (EE)"),
                data: targetData,
            },
        ]);
    }
    const planDurations = plans.reduce((acc, plan) => {
        const planDuration = intervalToDuration({
            start: plan.start_timestamp,
            end: plan.end_timestamp,
        });
        if (acc[plan.exam]) {
            return {
                ...acc,
                [plan.exam]: intervalToDuration({
                    start: 0,
                    end:
                        milliseconds(acc[plan.exam]) +
                        milliseconds(planDuration),
                }),
            };
        } else {
            return {
                ...acc,
                [plan.exam]: planDuration,
            };
        }
    }, {});

    const recordDurations = records.reduce((acc, record) => {
        const recordDuration = intervalToDuration({
            start: record.start_timestamp,
            end: record.end_timestamp,
        });
        if (acc[record.exam]) {
            return {
                ...acc,
                [record.exam]: intervalToDuration({
                    start: 0,
                    end:
                        milliseconds(acc[record.exam]) +
                        milliseconds(recordDuration),
                }),
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
        planDuration: formatDuration(planDurations[key] || { minutes: 0 }, {
            locale: ja,
        }),
        recordDuration: formatDuration(recordDurations[key] || { minutes: 0 }, {
            locale: ja,
        }),
    }));
    const rowLength = Math.max(
        ...weeklyData.map((dailyData) => dailyData.data.length)
    );
    const prev = format(previousMonday(start), "yyyyMMdd");
    const next = format(nextMonday(start), "yyyyMMdd");
    // </CalendarLogicModel>
    const title = process.env.SYSTEM_NAME;

    // <calendar.ejs>
    let html = `<!DOCTYPE html>
<html>
<head>
    <title>${title}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" />
    <link rel="stylesheet" href="/stylesheets/style.css" />
</head>
<body>
    <nav class="navbar navbar-dark bg-primary navbar-expand-lg">
        <div class="container-fluid">
            <a class="navbar-brand" href="/">${title}</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" >
                <span class="navbar-toggler-icon"></span>
            </button>
        </div>
    </nav>
    <br />
    <div class="container-fluid">
        <div class="row">
            <div class="col-2">
                <nav class="nav flex-column">
                    <a class="nav-link" href="#">学習予定登録</a>
                    <a class="nav-link" href="#">学習実績登録</a>
                    <a class="nav-link" href="#">試験情報登録</a>
                    <a class="nav-link" href="#">模試結果登録</a>
                    <a class="nav-link" href="#">試験結果登録</a>
                </nav>
            </div>
            <div class="col-10">
                <div class="row">
                    <div class="col"></div>
                    <div class="col text-center">
                        <button type="button" class="btn btn-primary" onclick="location.href='/?date=${prev}'" >
                            ←
                        </button>
                    </div>
                    <div class="col text-center">
                        <h1>カレンダー</h1>
                    </div>
                    <div class="col text-center">
                        <button type="button" class="btn btn-primary" onclick="location.href='/?date=${next}'" >
                            →
                        </button>
                    </div>
                    <div class="col"></div>
                </div>
                <div class="row">
                    <div class="col">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="row">試験名</th>
                                    <th scope="row">予定</th>
                                    <th scope="row">実績</th>
                                </tr>
                            </thead>
                            <tbody>`;
    for (let i = 0; i < weeklyStatistics.length; i++) {
        html += `<tr>`;
        html += `    <td>${weeklyStatistics[i].examName}</td>`;
        html += `    <td>${weeklyStatistics[i].planDuration}</td>`;
        html += `    <td>${weeklyStatistics[i].recordDuration}</td>`;
        html += `</tr>`;
    }
    html += `
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>`;
    for (let i = 0; i < weeklyData.length; i++) {
        html += `<th scope="col">${weeklyData[i].displayDate}</th>`;
    }
    html += `
                                </tr>
                            </thead>
                            <tbody>`;
    for (let y = 0; y < rowLength; y++) {
        html += `<tr>`;
        html += `<th scope="row">${y + 1}</th>`;
        for (let x = 0; x < weeklyData.length; x++) {
            if (weeklyData[x].data[y]) {
                if (weeklyData[x].data[y].isPlan) {
                    html += `<td class="plan">${weeklyData[x].data[y].title}</td>`;
                } else {
                    html += `<td class="record">${weeklyData[x].data[y].title}</td>`;
                }
            } else {
                html += `<td></td>`;
            }
        }
        html += `</tr>`;
    }
    html += `
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous" ></script>
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
</body>
</html>
`;
    // </calendar.ejs>
    res.setHeader("Content-Type", "text/html");
    res.send(html);
});

module.exports = router;
