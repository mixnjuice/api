create table "user" (
  id bigserial not null,
  email_address varchar(200) not null,
  password text default null,
  created timestamp not null default now(),
  activation_code varchar(64) default null,

  constraint pk_user primary key (id),
  constraint uk1_user unique (email_address)
);

create table data_supplier (
  id serial not null,
  name text not null,
  code varchar(5) not null,

  constraint pk_data_supplier primary key (id),
  constraint uk1_data_supplier unique (name),
  constraint uk2_data_supplier unique (code)
);

create table diluent (
  id serial not null,
  name text not null,
  slug text not null,
  code varchar(5) not null,
  density numeric(5, 4) default 1, -- e.g. 1.0567g/ml

  constraint pk_diluent primary key (id),
  constraint uk2_diluent unique (code)
);

create table vendor (
  id serial not null,
  name text not null,
  slug text not null,
  code varchar(5) not null,

  constraint pk_vendor primary key (id),
  constraint uk1_vendor unique (code),
  constraint uk2_vendor unique (slug)
);

create table flavor (
  id bigserial not null,
  vendor_id int not null,
  name varchar(200) not null,
  slug varchar(200) default null,
  density numeric(5, 4),

  constraint pk_flavor primary key (id),
  constraint uk1_flavor unique (vendor_id, name),
  constraint uk2_flavor unique (slug),
  constraint fk1_flavor foreign key (vendor_id) references vendor (id)
);

create table flavor_identifier (
  flavor_id bigint not null,
  data_supplier_id int not null,
  identifier text not null,

  constraint pk_flavor_identifier primary key (flavor_id, data_supplier_id),
  constraint uk1_flavor_identifier unique (data_supplier_id, identifier),
  constraint fk1_flavor_identifier foreign key (flavor_id) references flavor (id),
  constraint fk2_flavor_identifier foreign key (data_supplier_id) references data_supplier (id)
);

create table recipe (
  id bigserial not null,
  user_id bigint not null,
  name varchar(200) not null,
  created timestamp not null default now(),
  view_count int not null,

  constraint pk_recipe primary key (id),
  constraint uk1_recipe unique (user_id, name),
  constraint fk1_recipe foreign key (user_id) references "user" (id)
);

create table preparation (
  recipe_id bigserial not null,
  user_id bigint not null,
  volume_ml varchar(200) not null,
  nicotine_millipercent numeric(4,4) not null default 0,
  created timestamp not null default now(),
  view_count int not null default 0,

  constraint pk_preparation primary key (recipe_id, user_id),
  constraint fk1_preparation foreign key (recipe_id) references recipe (id),
  constraint fk2_preparation foreign key (user_id) references "user" (id)
);

create table users_flavors (
  user_id bigint not null,
  flavor_id bigint not null,
  cost_per_ml numeric(5, 2) default null,
  purchased timestamp default null,
  created timestamp not null default now(),
  min_millipercent numeric(4, 4) default null, -- four fractional digits
  max_millipercent numeric(4, 4) default null, -- e.g. .2048 = 20.48%
  notes varchar(8192) default null,

  constraint pk_users_flavors primary key (user_id, flavor_id),
  constraint fk1_users_flavors foreign key (user_id) references "user" (id),
  constraint fk2_users_flavors foreign key (flavor_id) references flavor (id)
);

create table recipes_flavors (
  recipe_id bigint not null,
  flavor_id bigint not null,
  millipercent numeric(4, 4),

  constraint pk_recipes_flavors primary key (recipe_id, flavor_id),
  constraint fk1_recipes_flavors foreign key (recipe_id) references recipe (id),
  constraint fk2_recipes_flavors foreign key (flavor_id) references flavor (id)
);

create table recipes_diluents (
  recipe_id bigint not null,
  diluent_id int not null,
  millipercent numeric(4, 4),

  constraint pk_recipes_diluents primary key (recipe_id, diluent_id),
  constraint fk1_recipes_diluents foreign key (recipe_id) references recipe (id),
  constraint fk2_recipes_diluents foreign key (diluent_id) references diluent (id)
);
