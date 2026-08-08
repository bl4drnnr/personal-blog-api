-- The site_config and about tables are singletons (CHECK id = 1). Creating the
-- rows here guarantees every environment has them without depending on seeds.
INSERT INTO "site_config" ("id") VALUES (1) ON CONFLICT DO NOTHING;--> statement-breakpoint
INSERT INTO "about" ("id") VALUES (1) ON CONFLICT DO NOTHING;
