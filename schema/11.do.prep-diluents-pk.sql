alter table preparations_diluents
  add column id bigserial not null,
  drop constraint pk_preparations_diluents,
  add constraint pk_preparations_diluents primary key (id);
