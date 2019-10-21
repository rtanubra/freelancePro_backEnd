CREATE TABLE flp_promos(
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    description TEXT,
    date_created DATE NOT NULL DEFAULT ('2019-10-20'),
    date_ending DATE NOT NULL DEFAULT ('2021-10-20')
);

CREATE TABLE flp_services (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  notes TEXT NOT NULL,
  cost FLOAT(8) NOT NULL,
  people INTEGER NOT NULL,
  promo_id INTEGER REFERENCES flp_promos(id),
  client_id INTEGER REFERENCES flp_clients(id) ON DELETE CASCADE NOT NULL
);

ALTER TABLE flp_clients 
  ADD open_promo INTEGER REFERENCES flp_promos(id);
