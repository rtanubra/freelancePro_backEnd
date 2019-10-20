BEGIN;

TRUNCATE
  flp_services,
  flp_clients,
  flp_promos,
  flp_user
  RESTART IDENTITY CASCADE;

INSERT INTO flp_user (email,password) 
VALUES
    ('rdtanubrata@gmail.com','test1'),
    ('mushtary@gmail.com','test2');

INSERT INTO flp_promos (name,description)
VALUES
  ('10-Spring2019','Give 10% off to select clients,Started October 2019'),
  ('5-Spring2019','Give 5% off to all clients.'),
  ('25-SuperReferral','Give 25% off to clients who have referred completed.');

INSERT INTO flp_clients (name, email,phone,user_id,open_promo)
VALUES
  ('Mundy Moon','MundyMoon@gmail.com','555-334-1234',1,1),
  ('Mutiara Dewi','MutiaraDewi@gmail.com','555-123-1234',1,2),
  ('Symbolic Cindy','SymbolicCindy@gmail.com','123-123-5555',1,3);

INSERT INTO flp_services (notes,cost,people, promo_id,client_id)
VALUES
  ('Hair and Makeup',600,3,1,1),
  ('Hair Wedding',450,3,2,2),
  ('Hair and Makeup Wedding',1450,6,3,3),
  ('Hair and Makeup Wedding',1650,7,3,3);



END;