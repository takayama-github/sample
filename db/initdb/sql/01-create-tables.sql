-- create tables
-- exams
create table if not exists exams (
    id uuid,
    name varchar(100) not null,
    date_planned timestamp with time zone,
    date_exam timestamp with time zone,
    point_qualified smallint,
    point_gained smallint,
    point_max smallint,
    comment varchar(200),
    primary key (id)
);

-- plans
create table if not exists plans (
    id uuid,
    exam uuid references exams(id),
    title varchar(50) not null,
    start_timestamp timestamp with time zone not null,
    end_timestamp timestamp with time zone not null,
    comment varchar(200),
    primary key (id)
);

-- records
create table if not exists records (
    id uuid,
    exam uuid references exams(id),
    title varchar(50) not null,
    start_timestamp timestamp with time zone not null,
    end_timestamp timestamp with time zone not null,
    comment varchar(200),
    primary key (id)
);
