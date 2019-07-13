alter table preparation
  add column id bigint not null default nextval('preparation_id_seq'),
  alter column recipe_id drop default,
  drop constraint pk_preparation,
  add constraint pk_preparation primary key (id);

create table preparations_diluents (
  preparation_id bigint not null,
  diluent_id int not null,
  millipercent numeric(4, 4) not null,
  nicotine_concentration numeric(4, 4) not null default 0,

  constraint pk_preparations_diluents primary key (preparation_id, diluent_id),
  constraint fk1_preparations_diluents foreign key (preparation_id) references preparation (id),
  constraint fk2_preparations_diluents foreign key (diluent_id) references diluent (id)
);
