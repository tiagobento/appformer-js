BEGIN TRANSACTION;

INSERT INTO spaces(name, info) VALUES ('HR', '{}');
INSERT INTO spaces(name, info) VALUES ('Sales', '{}');
INSERT INTO spaces(name, info) VALUES ('Logistics', '{}');
INSERT INTO spaces(name, info) VALUES ('TiagoBento', '{}');

INSERT INTO projects(name, url, info, space_id) VALUES ('Employee PTO', 'https://github.com/paulovmr/submarine-employee-pto', '{}', 1);
INSERT INTO projects(name, url, info, space_id) VALUES ('AppFormerJS', 'https://github.com/tiagobento/appformer-js', '{}', 1);
INSERT INTO projects(name, url, info, space_id) VALUES ('Hiring', 'https://github.com/paulovmr/submarine-hiring', '{}', 1);
INSERT INTO projects(name, url, info, space_id) VALUES ('Mortgages', 'https://github.com/paulovmr/submarine-mortgages', '{}', 2);

COMMIT;
