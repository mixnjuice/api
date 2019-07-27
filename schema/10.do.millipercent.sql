alter table preparations_diluents
  alter millipercent type smallint using millipercent * 1000,
  alter nicotine_concentration type smallint using nicotine_concentration * 1000;

alter table recipes_diluents
  alter millipercent type smallint using millipercent * 1000;

alter table recipes_flavors
  alter millipercent type smallint using millipercent * 1000;

alter table users_flavors
  alter min_millipercent type smallint using min_millipercent * 1000,
  alter max_millipercent type smallint using max_millipercent * 1000;
