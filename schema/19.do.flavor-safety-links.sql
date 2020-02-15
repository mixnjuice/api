create table ingredient_link (
  id serial not null,
  ingredient_id int not null,
  url varchar(200) not null,
  created timestamp not null default now(),

  constraint pk_ingredient_link primary key (id),
  constraint uk1_ingredient_link unique (url),
  constraint fk1_ingredient_link foreign key (ingredient_id) references ingredient (id)
);
