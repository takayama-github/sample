class ExamModel {
    static TABLE_NAME = "exams";

    static COLUMNS = [
        "id",
        "name",
        "date_planned",
        "date_exam",
        "point_qualified",
        "point_gained",
        "point_max",
        "comment",
    ];

    /**
     * @param {import("pg").Client} client
     */
    constructor(client) {
        this.client = client;
    }

    async findByID(id) {
        /** @type {import("pg").QueryConfig} */
        const query = {
            text: `SELECT ${ExamModel.COLUMNS.join(",")} FROM ${
                ExamModel.TABLE_NAME
            } WHERE id=$1`,
            values: [id],
        };
        const res = await this.client.query(query);
        return res.rows[0];
    }

    async search() {
        /** @type {import("pg").QueryConfig} */
        const query = {
            text: `SELECT ${ExamModel.COLUMNS.join(",")} FROM ${
                ExamModel.TABLE_NAME
            }`,
        };
        const res = await this.client.query(query);
        return res.rows;
    }

    /**
     * @param {{
     *      name: string,
     *      datePlanned: Date,
     *      dateExam: Date,
     *      pointQualified: number,
     *      pointGained: number,
     *      pointMax: number,
     *      comment: string
     * }} params
     * @returns
     */
    async create({
        id,
        name,
        datePlanned,
        dateExam,
        pointQualified,
        pointGained,
        pointMax,
        comment,
    }) {
        /** @type {import("pg").QueryConfig} */
        const query = {
            text: `INSERT INTO ${ExamModel.TABLE_NAME} VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            values: [
                id,
                name,
                datePlanned,
                dateExam,
                pointQualified,
                pointGained,
                pointMax,
                comment,
            ],
        };
        return this.client.query(query);
    }
}

module.exports = ExamModel;
