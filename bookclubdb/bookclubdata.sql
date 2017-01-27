#bookclubdata.sql
--inserting the data into bookclub tables
--delete from club;
truncate club;
insert into club (name, created,descr) values 
('Club 0', "2015-12-27 08:25:00", 'do not delete this bookclub')
;
truncate member;
insert into member (name, address, email, reading_interest) values
('Aamir Naveed', '123 Park Ave, Weehawken, NJ', 'a.n@theclub.com', 'Poetry'),
('Azeel Sajjad', '321 Park Ave, NY', 'a.s@theclub.com', 'fiction'),
('Musafir Luqman', '1 Chairing Cross, Lahore', 'm.l@theclub.com', 'Urdu Literature' ),
('Naeem Iqbal', 'Lal Haveli, Pindi', 'n.i@theclub.com', 'PULP FCITION'),
('Nawab Ali', '7318 73th St, NY', 'n.a@theclub.com','Philosophy' ),
('Miraj Bashir', '5 Mall Rd, Lahore', 'm.b@theclub.com', 'History'),
('Naghma Naushad', '50 Bay St, Staten Island, NY', 'n.n@theclub.com', 'Science Fiction')
;

truncate clubmember;
insert into clubmember (joined, club, member) values
(now(), 1, 1),
("2015-12-01", 1, 7),
("2015-11-25", 1, 4),
("2015-11-13", 1, 6),
("2015-12-11", 1, 3),
("2015-11-25", 1, 2),
("2015-11-23", 1, 5)
;
