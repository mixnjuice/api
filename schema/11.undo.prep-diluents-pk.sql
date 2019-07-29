alter table preparations_diluents
  drop constraint pk_preparations_diluents,
  add constraint pk_preparations_diluents primary key (preparation_id, diluent_id),
  drop column id;
