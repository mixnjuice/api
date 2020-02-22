create table preference (
  id serial not null,
  name varchar(100) not null,
  key varchar(200) not null,
  description text default null,
  created timestamp not null default now(),

  constraint pk_preference primary key (id),
  constraint uk1_preference unique (name),
  constraint uk2_preference unique (key)
);

create table users_preferences (
  user_id bigint not null,
  preference_id int not null,
  value varchar(100) not null,
  created timestamp not null default now(),
  updated timestamp default null,

  constraint pk_users_preferences primary key (user_id, preference_id),
  constraint fk1_users_preferences foreign key (user_id) references "user" (id),
  constraint fk2_users_preferences foreign key (preference_id) references preference (id)
);
