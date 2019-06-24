create table user_token (
  token varchar(512) not null,
  user_id bigint not null,
  created timestamp not null default now(),
  expires timestamp not null,

  constraint pk_user_token primary key (token),
  constraint fk1_user_token foreign key (user_id) references "user" (id)
);

create table "role" (
  id serial not null,
  name varchar(200) not null,

  constraint pk_role primary key (id)
);

insert into "role" (name) values ('Administrator');
insert into "role" (name) values ('User');

create table users_roles (
  user_id bigint not null,
  role_id int not null,
  active boolean not null default true,
  created timestamp not null default now(),

  constraint pk_users_roles primary key (user_id, role_id),
  constraint fk1_users_roles foreign key (user_id) references "user" (id),
  constraint fk2_users_roles foreign key (role_id) references "role" (id)
);
