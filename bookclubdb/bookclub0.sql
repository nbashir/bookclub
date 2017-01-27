# bookclub0.sql
--making of book club tables

select "Creating new database bookclub" as "";
drop database if exists bookclub;
create database bookclub;
use bookclub;
########### club table
# id: autoincrement
# name: varchar(200)
###########

drop table if exists club;
create table club(
id smallint unsigned not null auto_increment,
name varchar(100) not null,
created datetime not null, 
descr varchar(1000),
primary key (id)
);
show tables;
describe club;

########### member table
# id: autoincrement
# name: varchar(30): Ali Khan
# address: varchar(100): 123 Park Ave
# email address: varchar(100): ali@gmail.com
# reading interests: varchar(30): fiction, non-fiction
# club: references club(id)
drop table if exists member;
create table member(
id smallint unsigned not null auto_increment,
name varchar(100) not null,
address varchar(1000) not null,
email varchar(100) not null,
reading_interest varchar(100) not null,
primary key (id)
);
describe member;

########### clubmember table
# club: references club(id)
# member: references member(id)

drop table if exists clubmember;
create table clubmember(
club smallint unsigned not null references club(id) on delete cascade, 
member smallint unsigned not null references member(id) on delete cascade,
joined datetime not null
);
describe clubmember;
/*
########### book table
# id: autoincrement
# title: varchar(200)
# author: varchar(100)
# type: varchar(30): fiction, non-fiction
# isbn10: varchar(10)
# isbn13: varchar(13)
# book: references book(id)
# member: references member(id)
# score: smallint
########### meeting table
# date: datetime
# bookselection: references book(id)
# venue: varchar(100)
*/
