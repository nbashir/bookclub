--bookclub0.pg.sql
--making of book club tables for postgresql

\set ON_ERROR_STOP on
\echo 'Creating new database bookclub'
drop database if exists bookclub;
create database bookclub;
\c bookclub;
--########### club table
--# id: autoincrement
--# name: varchar(200)
--###########

drop table if exists club;
create table club(
id serial primary key,
name varchar(100) not null,
created timestamptz not null, 
descr varchar(1000)
);
\d club;

--########### member table
--# id: autoincrement
--# name: varchar(30): Ali Khan
--# address: varchar(100): 123 Park Ave
--# email address: varchar(100): ali@gmail.com
--# reading interests: varchar(30): fiction, non-fiction
--# club: reference:ws club(id)
drop table if exists member;
create table member(
id serial primary key,
name varchar(100) not null,
address varchar(1000) not null,
email varchar(100) not null,
reading_interest varchar(100) not null
);
\d member;

--########### clubmember table
-- club: references club(id)
-- member: references member(id)

drop table if exists clubmember;
create table clubmember(
clubid int references club on delete cascade, 
memberid int references member on delete cascade,
joined timestamptz not null
);

\d clubmember;

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
