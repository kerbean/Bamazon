CREATE DATABASE bamazon;
Use bamazon;

CREATE TABLE products(
	item_id int not null auto_increment,
    product_name varchar(100) not null,
    department_name varchar(100),
    price float,
    stock_quantity int,
    primary key (item_id)
    );
    
insert into products (product_name,department_name,price,stock_quantity) values ("Pencil","School Supplies",1.00,30);
insert into products (product_name,department_name,price,stock_quantity) values ("Scissors","School Supplies",3.50,15);
insert into products (product_name,department_name,price,stock_quantity) values ("Sign Pen","Office Supplies",14.97,25);
insert into products (product_name,department_name,price,stock_quantity) values ("Macbook","Electronics",1299.00,20);
insert into products (product_name,department_name,price,stock_quantity) values ("iPhone 15s 3TB","Electronics",3499.00,37);
insert into products (product_name,department_name,price,stock_quantity) values ("Samsung Note 25","Electronics",1299.00,49);
insert into products (product_name,department_name,price,stock_quantity) values ("Peanut Butter","Food",3.74,97);
insert into products (product_name,department_name,price,stock_quantity) values ("Choco Mallows","Food",4.12,83);
insert into products (product_name,department_name,price,stock_quantity) values ("LG 3D Printer - Adult Edition","Office Supplies",1479.00,10);
insert into products (product_name,department_name,price,stock_quantity) values ("Pleasure Doll","Office Supplies",379.00,274);

