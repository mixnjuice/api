create table permission_subject (
  id serial not null,
  name varchar(50) not null,

  constraint pk_permission_subject primary key (id),
  constraint uk1_permission_subject unique (name)
);

create table permission_action (
  id serial not null,
  name varchar(50) not null,

  constraint pk_permission_action primary key (id),
  constraint uk1_permission_action unique (name)
);

create table roles_permissions (
  role_id int not null,
  permission_subject_id int not null,
  permission_action_id int not null,

  constraint pk_roles_permissions primary key (role_id, permission_subject_id, permission_action_id),
  constraint fk1_roles_permissions foreign key (role_id) references "role" (id),
  constraint fk2_roles_permissions foreign key (permission_subject_id) references permission_subject (id),
  constraint fk3_roles_permissions foreign key (permission_action_id) references permission_action (id)
);

insert into permission_subject (name) values
  ('data'),
  ('diluent'),
  ('flavor'),
  ('flavors'),
  ('preparation'),
  ('recipe'),
  ('recipes'),
  ('register'),
  ('role'),
  ('roles'),
  ('stats'),
  ('user');

insert into permission_action (name) values
  ('read'),
  ('create'),
  ('update'),
  ('delete'),
  ('manage');

insert into "role" (name) values ('Guest');

insert into roles_permissions
  select r.id, ps.id, pa.id
  from
    "role" r
    join permission_subject ps on ps.name in ('recipes', 'recipe', 'flavor', 'flavors', 'preparation', 'role', 'roles', 'user')
    join permission_action pa on pa.name = 'read'
  where r.name = 'Guest';

insert into roles_permissions
  select r.id, ps.id, pa.id
  from
    "role" r
    join permission_subject ps on ps.name in ('recipes', 'recipe', 'flavor', 'flavors', 'preparation', 'role', 'roles', 'user')
    join permission_action pa on pa.name = 'read'
  where r.name = 'User';

insert into roles_permissions
  select r.id, ps.id, pa.id
  from
    "role" r
    join permission_subject ps on ps.name in ('recipe', 'flavors', 'preparation')
    join permission_action pa on pa.name in ('create', 'update', 'delete')
  where r.name = 'User';

insert into roles_permissions
  select r.id, ps.id, pa.id
  from
    "role" r
    cross join permission_subject ps
    cross join permission_action pa
  where r.name = 'Administrator';

create view permission_summary as
  select
    r.id role_id,
    r.name role_name,
    ps.name permission_subject_name,
    pa.name permission_action_name
  from
    roles_permissions rp
    join "role" r on rp.role_id = r.id
    join permission_subject ps on rp.permission_subject_id = ps.id
    join permission_action pa on rp.permission_action_id = pa.id;