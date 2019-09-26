alter table recipe
  drop constraint uk1_recipe,
  alter view_count set default 0;
