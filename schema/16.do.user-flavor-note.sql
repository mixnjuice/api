create table user_flavor_note (
  user_id bigint not null,
  flavor_id bigint not null,
  created timestamp not null default now(),
  note text default null,

  constraint pk_user_flavor_note primary key (user_id, flavor_id),
  constraint fk1_user_flavor_note foreign key (user_id) references "user" (id),
  constraint fk2_user_flavor_note foreign key (flavor_id) references flavor (id)
);