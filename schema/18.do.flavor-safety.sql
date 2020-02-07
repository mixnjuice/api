create table ingredient_category (
  id serial not null,
  name varchar(50) not null,
  ordinal int not null,
  description text not null,

  constraint pk_ingredient_category primary key (id),
  constraint uk1_ingredient_category unique (name),
  constraint uk2_ingredient_category unique (ordinal)
);

insert into ingredient_category (name, ordinal, description) values ('Avoid', 1, 'Flavors in this category should not be used.');
insert into ingredient_category (name, ordinal, description) values ('Caution', 2, 'Flavors in this category should only be used sparingly.');
insert into ingredient_category (name, ordinal, description) values ('Research', 3, 'Flavors in this category are being researched further.');

create table ingredient (
  id serial not null,
  name varchar(100) not null,
  cas_number varchar(50) not null,
  ingredient_category_id int not null,
  notes text default null,
  created timestamp default now(),
  updated timestamp default null,

  constraint pk_ingredient primary key (id),
  constraint uk1_ingredient unique (name, cas_number),
  constraint uk2_ingredient unique (cas_number),
  constraint fk1_ingredient foreign key (ingredient_category_id) references ingredient_category (id)
);

insert into ingredient (name, cas_number, ingredient_category_id) values ('Acetoin', '513-86-0', 3);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Acetyl Propionyl', '600-14-6', 3);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Acetyl Pyrazine', '22047-25-2', 3);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Anise oil', '84650-59-9', 3);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Anise oil', '84775-42-8', 3);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Caprylic Acid', '124-07-2', 3);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Caramel color', '8028-89-5', 1);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Cinnamon leaf oil', '8015-91-6', 1);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Clove leaf oil', '8000-34-8', 3);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Clove/tarragon oil', '90131-45-6', 3);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Cocoa Butter', '8002-31-1', 1);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Corn Syrup', '8029-43-4', 1);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Diacetyl', '431-03-8', 3);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Fennel oil', '8006-84-6', 3);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Fructose', '57-48-7', 1);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Furfuryl alcohol', '98-0-0', 1);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Lemon Oil', '68916-89-2', 2);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Lime Oil', '8008-26-2', 2);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Molasses', '8052-35-5', 2);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Nutmeg oil', '84082-68-8', 3);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Orange Oil', '8008-57-9', 2);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Peppermint oil', '8006-90-4', 1);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Polysorbate 80', '9005-65-6 ', 1);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Rose oxide', '16409-43-1', 1);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Sodium Chloride', '7647-14-5', 2);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Sucralose', '56038-13-2', 1);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Tarragon oil', '8016-88-4', 3);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Triethyl Citrate', '77-93-0', 3);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Vitamin E Acetate', '58-95-7', 1);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Vitamin E', '1406-18-4', 1);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Xylose', '58-86-6', 1);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Stevia', '58543-16-1', 3);
insert into ingredient (name, cas_number, ingredient_category_id) values ('Stevioside', '57817-89-7', 3);

create table flavors_ingredients (
  flavor_id bigint not null,
  ingredient_id int not null,
  created timestamp not null default now(),
  updated timestamp not null,

  constraint pk_flavors_ingredients primary key (flavor_id, ingredient_id),
  constraint fk1_flavors_ingredients foreign key (flavor_id) references flavor (id),
  constraint fk2_flavors_ingredients foreign key (ingredient_id) references ingredient (id)
);
