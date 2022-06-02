class PlanModel {
    static TABLE_NAME = "plans";

    static COLUMNS = [
        "id",
        "exam",
        "title",
        "start_timestamp",
        "end_timestamp",
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
            text: `SELECT ${PlanModel.COLUMNS.join(",")} FROM ${
                PlanModel.TABLE_NAME
            } WHERE id=$1`,
            values: [id],
        };
        const res = await this.client.query(query);
        return res.rows[0];
    }

    async search({ start, end }) {
        /** @type {import("pg").QueryConfig} */
        const query = {
            text: `SELECT ${PlanModel.COLUMNS.join(",")} FROM ${
                PlanModel.TABLE_NAME
            } WHERE start_timestamp >= $1 and end_timestamp <= $2 ORDER BY start_timestamp`,
            values: [start, end],
        };
        const res = await this.client.query(query);
        return res.rows;
    }

    async create({ id, exam, title, startTimestamp, endTimestamp, comment }) {
        /** @type {import("pg").QueryConfig} */
        const query = {
            text: `INSERT INTO ${PlanModel.TABLE_NAME} VALUES ($1, $2, $3, $4, $5, $6)`,
            values: [id, exam, title, startTimestamp, endTimestamp, comment],
        };
        return this.client.query(query);
    }
}

module.exports = PlanModel;
