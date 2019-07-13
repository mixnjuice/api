drop table preparations_diluents;

alter table preparation
  drop constraint pk_preparation,
  drop column id,
  add constraint pk_preparation primary key (recipe_id, user_id),
  alter column recipe_id set default nextval('preparation_id_seq');
