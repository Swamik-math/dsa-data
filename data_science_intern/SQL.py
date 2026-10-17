# create table NAMES(id integer primary key, Name text, phone integer);

# create table CUSTOMERS(
# id int not null,
# name varchar(20) not null,
# age int not null,
# address char(25),
# salary decimal(18, 2),
# primary key (id)
# );

# alter table CUSTOMERS add phone int;

# alter table CUSTOMERS add Gender char(1);

# -- TRUNCATE TABLE -> is used to delete complete the data from an existing TABLE

# -- TRUNCATE TABLE CUSTOMERS;

# insert into CUSTOMERS values(2, "Jerry", 20, "noida", 500000, 30493489,'M');
# insert into CUSTOMERS values(3, "dksjaksj", 20, "nodkfj", 39843948, 93849489,'f');
# insert into CUSTOMERS values(4, "dksjaksj", 20, "nodkfj", 39843948, 93849489,'f');

# select* from CUSTOMERS;

# select name, age, salary, address from CUSTOMERS;

# select count(*) from CUSTOMERS;

# select distinct name from CUSTOMERS;
# select name from CUSTOMERS;

# select name from CUSTOMERS limit 1;

# update CUSTOMERS set name = 'coool' where id = 3;

# select* from CUSTOMERS;

# delete from CUSTOMERS where id = 4;
# select* from CUSTOMERS;

