const PlanLogicModel = require("../../models/PlanLogicModel");

const { mockExamModel, mockPlanModel } = require("../mock/models");

const planLogicModel = new PlanLogicModel(mockExamModel, mockPlanModel);

describe("cancel-slot: statusCode: 200", () => {
    it("getFormData", async () => {
        const expected = {
            exams: [
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
            ],
        };
        const result = await planLogicModel.getFormData();
        expect(result).toEqual(expected);
    });

    it("create", async () => {
        const expected = {};
        const result = await planLogicModel.create();
        expect(result).toEqual(expected);
    });
});
