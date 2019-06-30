alter table recipes_diluents alter millipercent drop not null;
alter table recipes_flavors alter millipercent drop not null;

alter sequence preparation_id_seq rename to preparation_recipe_id_seq;
