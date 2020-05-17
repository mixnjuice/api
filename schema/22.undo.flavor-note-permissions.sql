delete from roles_permissions
  where permission_subject_id in (select id from permission_subject where name = 'flavorNote');

delete from permission_subject where name = 'flavorNote';