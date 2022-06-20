class MockExamModel {
    /**
     * idで試験情報を取得
     * @param {string} id
     * @returns
     */
    async findByID(id) {
        return {
            id,
            name: "Java Silver",
            datePlanned: null,
            dateExam: null,
            pointQualified: null,
            pointGained: null,
            pointMax: null,
            comment: "コメント",
        };
    }

    /**
     * 試験情報を全件取得
     * @returns
     */
    async search() {
        return [
            {
                id: "00000000-0000-0000-0000-000000000000",
                name: "Java Silver",
                datePlanned: null,
                dateExam: null,
                pointQualified: null,
                pointGained: null,
                pointMax: null,
                comment: "コメント",
            },
        ];
    }

    /**
     * 試験情報をDBに登録
     * @param {{
     *      id: string,
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
    async create() {
        return {};
    }
}

module.exports = MockExamModel;
