-- create indexes
-- exams
create index exams_id on exams (id);

-- plans
create index plans_id on plans (id);
create index plans_start_timestamp on plans (start_timestamp);
create index plans_end_timestamp on plans (end_timestamp);

-- records
create index records_id on records (id);
create index records_start_timestamp on records (start_timestamp);
create index records_end_timestamp on records (end_timestamp);
