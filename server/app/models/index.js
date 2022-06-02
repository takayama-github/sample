const { Client } = require("pg");

const ExamModel = require("./ExamModel");
const PlanModel = require("./PlanModel");
const RecordModel = require("./RecordModel");

const CalendarLogicModel = require("./CalendarLogicModel");
const DateLogicModel = require("./DateLogicModel");
const PlanLogicModel = require("./PlanLogicModel");
const RecordLogicModel = require("./RecordLogicModel");

const client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOSTNAME,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
});
client.connect();

const examModel = new ExamModel(client);
const planModel = new PlanModel(client);
const recordModel = new RecordModel(client);

const calendarLogic = new CalendarLogicModel(examModel, planModel, recordModel);
const planLogic = new PlanLogicModel(examModel, planModel);
const recordLogic = new RecordLogicModel(examModel, recordModel);

module.exports = {
    examModel,
    planModel,
    recordModel,
    calendarLogic,
    dateLogic: DateLogicModel,
    planLogic,
    recordLogic,
};
