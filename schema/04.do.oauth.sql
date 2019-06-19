create table user_token (
  token varchar(512) not null,
  user_id bigint not null,
  created timestamp not null default now(),
  expires timestamp not null,

  constraint pk_user_token primary key (token),
  constraint fk1_user_token foreign key (user_id) references "user" (id)
);
