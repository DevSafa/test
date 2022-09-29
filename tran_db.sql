-- -------------------------------------------------------------
-- TablePlus 4.8.8(450)
--
-- https://tableplus.com/
--
-- Database: tran_db
-- Generation Time: 2022-09-24 19:00:04.6640
-- -------------------------------------------------------------


INSERT INTO "public"."Room" ("id", "name", "type", "password", "owner") VALUES
(1, 'room1', 'public', '$argon2id$v=19$m=4096,t=3,p=1$t8EjbeMoiOvJMTeRb0oLmQ$E/o5QRnALC4nymHQepREYBxO1W+RAVFtUNLIQbQ7WAI', 'ssghuri'),
(2, 'room2', 'public', '$argon2id$v=19$m=4096,t=3,p=1$Y+WSHLto3Ztkz/+lZcPZZQ$ev5Frf5awKU1ot445ZmY0Mq+aEDsH+Ub0y00d3BBILY', 'sbarka'),
(3, 'room3', 'protected', '$argon2id$v=19$m=4096,t=3,p=1$P3TqoGXGDPSIqTuh1jFFIA$zJvEnkg6oJ9oMG7w+1Po+nk2zNj92WhCQANhgkl/t38', 'sbarka');

INSERT INTO "public"."Users_room" ("id", "user_id", "user_role", "room_id", "state_user") VALUES
(2, 'sbarka', 'owner', 'room2', ''),
(3, 'sbarka', 'owner', 'room3', ''),
(4, 'ssghuri', 'owner', 'room1', 'EMPTY'),
(6, 'ssghuri', 'admin', 'room2', 'EMPTY'),
(13, 'ssghuri', 'admin', 'room3', 'EMPTY');

