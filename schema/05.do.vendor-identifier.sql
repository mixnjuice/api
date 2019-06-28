create table vendor_identifier (
  vendor_id bigint not null,
  data_supplier_id int not null,
  identifier text not null,

  constraint pk_vendor_identifier primary key (vendor_id, data_supplier_id),
  constraint uk1_vendor_identifier unique (data_supplier_id, identifier),
  constraint fk1_vendor_identifier foreign key (vendor_id) references vendor (id),
  constraint fk2_vendor_identifier foreign key (data_supplier_id) references data_supplier (id)
);
