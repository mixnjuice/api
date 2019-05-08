create table vendor (
  id bigserial not null,
  code varchar(10) not null,
  name varchar(50) not null,

  constraint pk_vendor primary key (id),
  constraint uk1_vendor unique (code),
  constraint uk2_vendor unique (name)
);

create table flavor (
  id bigserial not null,
  vendor_id bigint not null,
  name varchar(200) not null,

  constraint pk_flavor primary key (id),
  constraint uk1_flavor unique (vendor_id, name),
  constraint fk1_flavor foreign key (vendor_id) references vendor (id)
);

create table recipe (
  id bigserial not null,
  name varchar(200) not null,

  constraint pk_recipe primary key (id),
  constraint uk1_recipe unique (name)
);

create table recipes_flavors (
  recipe_id bigint not null,
  flavor_id bigint not null,
  flavor_percentage numeric(4, 4), -- four fractional digits

  constraint pk_recipes_flavors primary key (recipe_id, flavor_id),
  constraint fk1_recipes_flavors foreign key (recipe_id) references recipe (id),
  constraint fk2_recipes_flavors foreign key (flavor_id) references flavor (id)
);
