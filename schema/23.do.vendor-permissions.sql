insert into permission_subject (name) values ('vendor'), ('vendors');

insert into roles_permissions
  select r.id, ps.id, pa.id
  from
    "role" r
    join permission_subject ps on ps.name in ('vendor', 'vendors')
    join permission_action pa on pa.name = 'read'
  where r.name = 'Guest';

insert into roles_permissions
  select r.id, ps.id, pa.id
  from
    "role" r
    join permission_subject ps on ps.name in ('vendor', 'vendors')
    join permission_action pa on pa.name in ('read', 'create', 'update', 'delete')
  where r.name = 'User';

insert into roles_permissions
  select r.id, ps.id, pa.id
  from
    "role" r
    join permission_subject ps on ps.name in ('vendor', 'vendors')
    join permission_action pa on pa.name in ('read', 'create', 'update', 'delete', 'manage')
  where r.name = 'Administrator';
  