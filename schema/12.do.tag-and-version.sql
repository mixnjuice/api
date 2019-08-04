alter table recipe rename user_id to creator_id;

alter table recipe
  add version int default 1,
  add parent_id bigint default null,
  add adapted_id bigint default null,
  add constraint fk2_recipe foreign key (parent_id) references recipe (id),
  add constraint fk3_recipe foreign key (adapted_id) references recipe (id);

create table tag (
  id bigserial not null,
  name varchar(200) not null,
  slug varchar(200) not null,
  created timestamp not null default now(),
  creator_id bigint not null,

  constraint pk_tag primary key (id),
  constraint uk1_tag unique (name),
  constraint uk2_tag unique (slug),
  constraint fk1_tag foreign key (creator_id) references "user" (id)
);

create table tags_flavors (
  tag_id bigint not null,
  flavor_id bigint not null,
  created timestamp not null default now(),
  creator_id bigint not null,

  constraint pk_tags_flavors primary key (tag_id, flavor_id),
  constraint fk1_tags_flavors foreign key (tag_id) references tag (id),
  constraint fk2_tags_flavors foreign key (flavor_id) references flavor (id)
);

create table tags_recipes (
  tag_id bigint not null,
  recipe_id bigint not null,
  created timestamp not null default now(),
  creator_id bigint not null,

  constraint pk_tags_recipes primary key (tag_id, recipe_id),
  constraint fk1_tags_recipes foreign key (tag_id) references tag (id),
  constraint fk2_tags_recipes foreign key (recipe_id) references tag (id)
);
