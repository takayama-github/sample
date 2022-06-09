class RecordModel {
    static TABLE_NAME = "records";

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

    /**
     * idで学習実績情報を取得
     * @param {string} id
     * @returns
     */
    async findByID(id) {
        /** @type {import("pg").QueryConfig} */
        const query = {
            text: `SELECT ${RecordModel.COLUMNS.join(",")} FROM ${
                RecordModel.TABLE_NAME
            } WHERE id=$1`,
            values: [id],
        };
        const res = await this.client.query(query);
        return res.rows[0];
    }

    /**
     * 指定期間の学習実績情報を全件取得
     * @param {{start: Date, end: Date}} params
     * @returns
     */
    async search({ start, end }) {
        /** @type {import("pg").QueryConfig} */
        const query = {
            text: `SELECT ${RecordModel.COLUMNS.join(",")} FROM ${
                RecordModel.TABLE_NAME
            } WHERE start_timestamp >= $1 and end_timestamp <= $2 ORDER BY start_timestamp`,
            values: [start, end],
        };
        const res = await this.client.query(query);
        return res.rows;
    }

    /**
     * 学習実績情報をDBに登録
     * @param {{
     *      id: string,
     *      exam: string,
     *      title: string,
     *      startTimestamp: Date,
     *      endTimestamp: Date,
     *      comment: string
     * }} params
     * @returns
     */
    async create({ id, exam, title, startTimestamp, endTimestamp, comment }) {
        /** @type {import("pg").QueryConfig} */
        const query = {
            text: `INSERT INTO ${RecordModel.TABLE_NAME} VALUES ($1, $2, $3, $4, $5, $6)`,
            values: [id, exam, title, startTimestamp, endTimestamp, comment],
        };
        return this.client.query(query);
    }
}

module.exports = RecordModel;
