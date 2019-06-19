alter table users_flavors
  add cost_per_ml numeric(5, 2) default null,
  add purchased timestamp not null default now(),
  add notes varchar(8192) default null;