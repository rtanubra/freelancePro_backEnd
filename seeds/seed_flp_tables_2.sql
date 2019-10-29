BEGIN;

TRUNCATE
  flp_services,
  flp_clients,
  flp_promos,
  flp_user
  RESTART IDENTITY CASCADE;

INSERT INTO flp_user (email,password) 
VALUES
    ('rdtanubrata@gmail.com','$2a$10$hwtWWd1Uk5EDBpAVV3FRN.Xqmos6FO4WAk5rV8U8RYTOSw46GadVq'),
    ('mushtary@gmail.com','$2a$10$gP9WCgfowSn6ooNa9BEzBeVk9PthOwdgC3dKl4JdVYfDgRFsxmwyW');

INSERT INTO flp_promos (name,description)
VALUES
  ('10-Spring2019','Give 10% off to select clients,Started October 2019'),
  ('5-Spring2019','Give 5% off to all clients.'),
  ('25-SuperReferral','Give 25% off to clients who have referred completed.');

INSERT INTO flp_clients (name, email,phone,user_id,open_promo)
VALUES
  ('Mundy Moon','mundymoon@gmail.com','555-334-1234',1,1),
  ('Madara Dewi','madaradewi@gmail.com','555-123-1234',1,2),
  ('Symbolic Cindy','symboliccindy@gmail.com','123-123-5555',1,3);

INSERT INTO flp_services (notes,cost,people, promo_id,client_id)
VALUES
  ('Hair and Makeup',600,3,1,1),
  ('Hair Wedding',450,3,2,2),
  ('Hair and Makeup Wedding',1450,6,3,3),
  ('Hair and Makeup Wedding',1650,7,3,3);



END;