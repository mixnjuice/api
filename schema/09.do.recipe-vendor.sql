alter table recipe
  add column notes text default null;

alter table vendor
  add constraint uk3_vendor unique (name);
