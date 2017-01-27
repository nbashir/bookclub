--bookclubdata.pg.sql
\pset pager off
\set ON_ERROR_STOP on
--inserting the data into bookclub tables
\echo add mock data to bookclub database
\c bookclub

truncate club restart identity cascade;
insert into club (name, created,descr) values 
('Club 0', '2015-12-27 08:25:00', 'do not delete club0'),
('Club 1', '2016-01-15 10:05:00', 'do not deltet club1')
;
select * from club;

truncate member restart identity cascade;
insert into member (name, address, email, reading_interest) values
('Aamir Naveed', '123 Park Ave, Weehawken, NJ', 'a.n@theclub.com', 'Poetry'),
('Azeel Sajjad', '321 Park Ave, NY', 'a.s@theclub.com', 'fiction'),
('Musafir Luqman', '1 Chairing Cross, Lahore', 'm.l@theclub.com', 'Urdu Literature' ),
('Naeem Iqbal', 'Lal Haveli, Pindi', 'n.i@theclub.com', 'PULP FCITION'),
('Nawab Ali', '7318 73th St, NY', 'n.a@theclub.com','Philosophy' ),
('Miraj Bashir', '5 Mall Rd, Lahore', 'm.b@theclub.com', 'History'),
('Naghma Naushad', '50 Bay St, Staten Island, NY', 'n.n@theclub.com', 'Science Fiction')
;
select * from member;

truncate clubmember restart identity cascade;
insert into clubmember (joined, clubid, memberid) values
(now(), 1, 1),
('2014-12-01', 1, 7),
('2013-01-25', 1, 4),
('2012-06-13', 1, 6),
('2011-12-11', 1, 3),
('2014-10-25', 1, 2),
('2015-11-23', 2, 5),
('2013-12-13', 2, 6),
('2011-10-11', 2, 3),
('2012-09-25', 2, 2),
('2015-11-23', 1, 5)
;
select c.name, m.name, date(joined), address from clubmember as cm join member as m on m.id=cm.memberid join club as c on c.id=cm.clubid;

