class MockPlanModel {
    /**
     * idで学習予定情報を取得
     * @param {string} id
     * @returns
     */
    async findByID(id) {
        return {
            id,
            exam: "Java Silver",
            title: "基礎学習",
            start_timestamp: new Date(2022, 4, 1, 7, 0, 0),
            end_timestamp: new Date(2022, 4, 1, 9, 0, 0),
            comment: "備考",
        };
    }

    /**
     * 指定期間の学習予定情報を全件取得
     * @param {{start: Date, end: Date}} params
     * @returns
     */
    async search({ start, end }) {
        return [
            {
                id: "00000000-0000-0000-0000-000000000000",
                exam: "Java Silver",
                title: "基礎学習",
                start_timestamp: start,
                end_timestamp: end,
                comment: "備考",
            },
        ];
    }

    /**
     * 学習予定情報をDBに登録
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
    async create() {
        return {};
    }
}

module.exports = MockPlanModel;
