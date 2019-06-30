alter table recipes_diluents alter millipercent set not null;
alter table recipes_flavors alter millipercent set not null;

alter sequence preparation_recipe_id_seq rename to preparation_id_seq;
