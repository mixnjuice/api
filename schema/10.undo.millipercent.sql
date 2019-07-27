alter table preparations_diluents
  alter millipercent type numeric(4, 4) using 0,
  alter nicotine_concentration type numeric(4, 4) using 0;

alter table recipes_diluents alter millipercent type numeric(4, 4) using 0;

alter table recipes_flavors alter millipercent type numeric(4, 4) using 0;

alter table users_flavors
  alter min_millipercent type numeric(4, 4) using 0,
  alter max_millipercent type numeric(4, 4) using 0;
