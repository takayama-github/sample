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
}

module.exports = ExamModel;
