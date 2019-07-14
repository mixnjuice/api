alter table recipe
  drop column notes;

alter table vendor
  drop constraint uk3_vendor;
  