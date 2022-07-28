create extension if not exists "uuid-ossp";

create table if not exists products (
	id uuid primary key default uuid_generate_v4(),
	title varchar(255),
	description text,
	price numeric(6, 4)
);

create table if not exists stocks (
	id uuid primary key default uuid_generate_v4(),
	product_id uuid,
	count int,
	foreign key ("product_id") references "products" ("id")
);

insert into
	products (description, id, price, title)
values
	('[MOCK] Short Product Description1','7567ec4b-b10c-48c5-9345-fc73c48a80aa',2.4,'[MOCK] ProductOne'),
	('Short Product Description3','7567ec4b-b10c-48c5-9345-fc73c48a80a0',10,'[MOCK] ProductNew'),
	('[MOCK] Short Product Description2','7567ec4b-b10c-48c5-9345-fc73c48a80a2',23,'[MOCK] ProductTop'),
	('[MOCK] Short Product Description7','7567ec4b-b10c-48c5-9345-fc73c48a80a1',15,'[MOCK] ProductTitle'),
	('[MOCK] Short Product Description2','7567ec4b-b10c-48c5-9345-fc73c48a80a3',23,'[MOCK] Product'),
	('[MOCK] Short Product Description4','7567ec4b-b10c-48c5-9345-fc73348a80a1',15,'[MOCK] ProductTest'),
	('[MOCK] Short Product Descriptio1','7567ec4b-b10c-48c5-9445-fc73c48a80a2',23,'[MOCK] Product2'),
	('[MOCK] Short Product Description7','7567ec4b-b10c-45c5-9345-fc73c48a80a1',15,'[MOCK] ProductName');

insert into
	stocks (count, product_id)
values
	(4,'7567ec4b-b10c-48c5-9345-fc73c48a80aa'),
	(6,'7567ec4b-b10c-48c5-9345-fc73c48a80a0'),
	(7,'7567ec4b-b10c-48c5-9345-fc73c48a80a2'),
	(12,'7567ec4b-b10c-48c5-9345-fc73c48a80a1'),
	(7,'7567ec4b-b10c-48c5-9345-fc73c48a80a3'),
	(8,'7567ec4b-b10c-48c5-9345-fc73348a80a1'),
	(2,'7567ec4b-b10c-48c5-9445-fc73c48a80a2'),
	(3,'7567ec4b-b10c-45c5-9345-fc73c48a80a1');
