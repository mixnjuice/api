alter table recipe
  add constraint uk1_recipe unique (creator_id, name),
  alter view_count drop default;
