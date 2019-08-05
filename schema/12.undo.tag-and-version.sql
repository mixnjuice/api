drop table tags_flavors;
drop table tags_recipes;
drop table tag;

alter table recipe
  drop column parent_id,
  drop column adapted_id,
  drop column version;

alter table recipe rename creator_id to user_id;
