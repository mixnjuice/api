create table user_profile (
  user_id bigint not null,
  name varchar(64) not null,
  location varchar(200) default null,
  bio text default null,
  url varchar(200) default null,

  constraint pk_user_profile primary key (user_id),
  constraint uk1_user_profile unique (name),
  constraint fk1_user_profile foreign key (user_id) references "user" (id)
);

alter table preparation alter volume_ml type numeric(4, 0) using 0;
