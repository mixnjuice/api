-- cannot truncate easily here because of foreign key constraints on the flavor
-- and vendor tables
delete from flavor;
delete from vendor;
