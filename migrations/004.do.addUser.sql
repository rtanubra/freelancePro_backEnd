ALTER TABLE flp_services
    ADD user_id INTEGER REFERENCES flp_user(id) 
        ON DELETE CASCADE  NOT NULL DEFAULT 1;

ALTER TABLE flp_promos
    ADD user_id INTEGER REFERENCES flp_user(id) 
        ON DELETE CASCADE  NOT NULL DEFAULT 1;