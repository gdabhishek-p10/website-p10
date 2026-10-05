import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`reset_password_requested_at\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`homepage_hero_prompts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_hero_prompts_order_idx\` ON \`homepage_hero_prompts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_hero_prompts_parent_id_idx\` ON \`homepage_hero_prompts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_clients_logos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`logo_id\` integer,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_clients_logos_order_idx\` ON \`homepage_clients_logos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_clients_logos_parent_id_idx\` ON \`homepage_clients_logos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`homepage_clients_logos_logo_idx\` ON \`homepage_clients_logos\` (\`logo_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_problem_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text DEFAULT 'systems',
  	\`label\` text,
  	\`headline\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_problem_items_order_idx\` ON \`homepage_problem_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_problem_items_parent_id_idx\` ON \`homepage_problem_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_pillars_items_chips\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage_pillars_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_pillars_items_chips_order_idx\` ON \`homepage_pillars_items_chips\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_pillars_items_chips_parent_id_idx\` ON \`homepage_pillars_items_chips\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_pillars_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`title\` text,
  	\`body\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_pillars_items_order_idx\` ON \`homepage_pillars_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_pillars_items_parent_id_idx\` ON \`homepage_pillars_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_case_studies_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`theme\` text DEFAULT 'dark',
  	\`tag\` text,
  	\`title\` text,
  	\`desc\` text,
  	\`image_id\` integer,
  	\`video_id\` integer,
  	\`story_url\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_case_studies_items_order_idx\` ON \`homepage_case_studies_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_case_studies_items_parent_id_idx\` ON \`homepage_case_studies_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`homepage_case_studies_items_image_idx\` ON \`homepage_case_studies_items\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`homepage_case_studies_items_video_idx\` ON \`homepage_case_studies_items\` (\`video_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_ai_labs_entries_chips\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage_ai_labs_entries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_ai_labs_entries_chips_order_idx\` ON \`homepage_ai_labs_entries_chips\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_ai_labs_entries_chips_parent_id_idx\` ON \`homepage_ai_labs_entries_chips\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_ai_labs_entries\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`tab_label\` text,
  	\`name\` text,
  	\`head\` text,
  	\`copy\` text,
  	\`url\` text,
  	\`video_id\` integer,
  	\`poster_id\` integer,
  	FOREIGN KEY (\`video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_ai_labs_entries_order_idx\` ON \`homepage_ai_labs_entries\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_ai_labs_entries_parent_id_idx\` ON \`homepage_ai_labs_entries\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`homepage_ai_labs_entries_video_idx\` ON \`homepage_ai_labs_entries\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`homepage_ai_labs_entries_poster_idx\` ON \`homepage_ai_labs_entries\` (\`poster_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_industries_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_industries_items_order_idx\` ON \`homepage_industries_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_industries_items_parent_id_idx\` ON \`homepage_industries_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_headline_before\` text,
  	\`hero_headline_accent\` text,
  	\`hero_headline_after\` text,
  	\`hero_lede\` text,
  	\`problem_heading\` text,
  	\`problem_lede\` text,
  	\`problem_image_id\` integer,
  	\`pillars_heading\` text,
  	\`pillars_lede\` text,
  	\`engineering_heading\` text,
  	\`engineering_lede\` text,
  	\`engineering_diagram_id\` integer,
  	\`case_studies_heading\` text,
  	\`case_studies_lede\` text,
  	\`ai_labs_heading\` text,
  	\`ai_labs_lede\` text,
  	\`industries_heading\` text,
  	\`industries_lede\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`problem_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`engineering_diagram_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_problem_problem_image_idx\` ON \`homepage\` (\`problem_image_id\`);`)
  await db.run(sql`CREATE INDEX \`homepage_engineering_engineering_diagram_idx\` ON \`homepage\` (\`engineering_diagram_id\`);`)
  await db.run(sql`CREATE INDEX \`homepage__status_idx\` ON \`homepage\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_homepage_v_version_hero_prompts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_homepage_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_hero_prompts_order_idx\` ON \`_homepage_v_version_hero_prompts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_hero_prompts_parent_id_idx\` ON \`_homepage_v_version_hero_prompts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_homepage_v_version_clients_logos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`logo_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_homepage_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_clients_logos_order_idx\` ON \`_homepage_v_version_clients_logos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_clients_logos_parent_id_idx\` ON \`_homepage_v_version_clients_logos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_clients_logos_logo_idx\` ON \`_homepage_v_version_clients_logos\` (\`logo_id\`);`)
  await db.run(sql`CREATE TABLE \`_homepage_v_version_problem_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon\` text DEFAULT 'systems',
  	\`label\` text,
  	\`headline\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_homepage_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_problem_items_order_idx\` ON \`_homepage_v_version_problem_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_problem_items_parent_id_idx\` ON \`_homepage_v_version_problem_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_homepage_v_version_pillars_items_chips\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_homepage_v_version_pillars_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_pillars_items_chips_order_idx\` ON \`_homepage_v_version_pillars_items_chips\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_pillars_items_chips_parent_id_idx\` ON \`_homepage_v_version_pillars_items_chips\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_homepage_v_version_pillars_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`title\` text,
  	\`body\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_homepage_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_pillars_items_order_idx\` ON \`_homepage_v_version_pillars_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_pillars_items_parent_id_idx\` ON \`_homepage_v_version_pillars_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_homepage_v_version_case_studies_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`theme\` text DEFAULT 'dark',
  	\`tag\` text,
  	\`title\` text,
  	\`desc\` text,
  	\`image_id\` integer,
  	\`video_id\` integer,
  	\`story_url\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_homepage_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_case_studies_items_order_idx\` ON \`_homepage_v_version_case_studies_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_case_studies_items_parent_id_idx\` ON \`_homepage_v_version_case_studies_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_case_studies_items_image_idx\` ON \`_homepage_v_version_case_studies_items\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_case_studies_items_video_idx\` ON \`_homepage_v_version_case_studies_items\` (\`video_id\`);`)
  await db.run(sql`CREATE TABLE \`_homepage_v_version_ai_labs_entries_chips\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_homepage_v_version_ai_labs_entries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_ai_labs_entries_chips_order_idx\` ON \`_homepage_v_version_ai_labs_entries_chips\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_ai_labs_entries_chips_parent_id_idx\` ON \`_homepage_v_version_ai_labs_entries_chips\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_homepage_v_version_ai_labs_entries\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`tab_label\` text,
  	\`name\` text,
  	\`head\` text,
  	\`copy\` text,
  	\`url\` text,
  	\`video_id\` integer,
  	\`poster_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_homepage_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_ai_labs_entries_order_idx\` ON \`_homepage_v_version_ai_labs_entries\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_ai_labs_entries_parent_id_idx\` ON \`_homepage_v_version_ai_labs_entries\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_ai_labs_entries_video_idx\` ON \`_homepage_v_version_ai_labs_entries\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_ai_labs_entries_poster_idx\` ON \`_homepage_v_version_ai_labs_entries\` (\`poster_id\`);`)
  await db.run(sql`CREATE TABLE \`_homepage_v_version_industries_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_homepage_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_industries_items_order_idx\` ON \`_homepage_v_version_industries_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_industries_items_parent_id_idx\` ON \`_homepage_v_version_industries_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_homepage_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_headline_before\` text,
  	\`version_hero_headline_accent\` text,
  	\`version_hero_headline_after\` text,
  	\`version_hero_lede\` text,
  	\`version_problem_heading\` text,
  	\`version_problem_lede\` text,
  	\`version_problem_image_id\` integer,
  	\`version_pillars_heading\` text,
  	\`version_pillars_lede\` text,
  	\`version_engineering_heading\` text,
  	\`version_engineering_lede\` text,
  	\`version_engineering_diagram_id\` integer,
  	\`version_case_studies_heading\` text,
  	\`version_case_studies_lede\` text,
  	\`version_ai_labs_heading\` text,
  	\`version_ai_labs_lede\` text,
  	\`version_industries_heading\` text,
  	\`version_industries_lede\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`version_problem_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_engineering_diagram_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_problem_version_problem_image_idx\` ON \`_homepage_v\` (\`version_problem_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_engineering_version_engineering_diag_idx\` ON \`_homepage_v\` (\`version_engineering_diagram_id\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_version__status_idx\` ON \`_homepage_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_created_at_idx\` ON \`_homepage_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_updated_at_idx\` ON \`_homepage_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_latest_idx\` ON \`_homepage_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_autosave_idx\` ON \`_homepage_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_header_nav_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`external\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_header_nav_links_order_idx\` ON \`site_settings_header_nav_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_header_nav_links_parent_id_idx\` ON \`site_settings_header_nav_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_footer_columns_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`external\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings_footer_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_footer_columns_links_order_idx\` ON \`site_settings_footer_columns_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_footer_columns_links_parent_id_idx\` ON \`site_settings_footer_columns_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_footer_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_footer_columns_order_idx\` ON \`site_settings_footer_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_footer_columns_parent_id_idx\` ON \`site_settings_footer_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`header_cta_label\` text,
  	\`header_cta_href\` text,
  	\`footer_copyright\` text,
  	\`footer_tagline\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings__status_idx\` ON \`site_settings\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_header_nav_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`external\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_header_nav_links_order_idx\` ON \`_site_settings_v_version_header_nav_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_header_nav_links_parent_id_idx\` ON \`_site_settings_v_version_header_nav_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_footer_columns_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`external\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v_version_footer_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_footer_columns_links_order_idx\` ON \`_site_settings_v_version_footer_columns_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_footer_columns_links_parent_id_idx\` ON \`_site_settings_v_version_footer_columns_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_footer_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_footer_columns_order_idx\` ON \`_site_settings_v_version_footer_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_footer_columns_parent_id_idx\` ON \`_site_settings_v_version_footer_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_header_cta_label\` text,
  	\`version_header_cta_href\` text,
  	\`version_footer_copyright\` text,
  	\`version_footer_tagline\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_version__status_idx\` ON \`_site_settings_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_created_at_idx\` ON \`_site_settings_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_updated_at_idx\` ON \`_site_settings_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_latest_idx\` ON \`_site_settings_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_autosave_idx\` ON \`_site_settings_v\` (\`autosave\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`homepage_hero_prompts\`;`)
  await db.run(sql`DROP TABLE \`homepage_clients_logos\`;`)
  await db.run(sql`DROP TABLE \`homepage_problem_items\`;`)
  await db.run(sql`DROP TABLE \`homepage_pillars_items_chips\`;`)
  await db.run(sql`DROP TABLE \`homepage_pillars_items\`;`)
  await db.run(sql`DROP TABLE \`homepage_case_studies_items\`;`)
  await db.run(sql`DROP TABLE \`homepage_ai_labs_entries_chips\`;`)
  await db.run(sql`DROP TABLE \`homepage_ai_labs_entries\`;`)
  await db.run(sql`DROP TABLE \`homepage_industries_items\`;`)
  await db.run(sql`DROP TABLE \`homepage\`;`)
  await db.run(sql`DROP TABLE \`_homepage_v_version_hero_prompts\`;`)
  await db.run(sql`DROP TABLE \`_homepage_v_version_clients_logos\`;`)
  await db.run(sql`DROP TABLE \`_homepage_v_version_problem_items\`;`)
  await db.run(sql`DROP TABLE \`_homepage_v_version_pillars_items_chips\`;`)
  await db.run(sql`DROP TABLE \`_homepage_v_version_pillars_items\`;`)
  await db.run(sql`DROP TABLE \`_homepage_v_version_case_studies_items\`;`)
  await db.run(sql`DROP TABLE \`_homepage_v_version_ai_labs_entries_chips\`;`)
  await db.run(sql`DROP TABLE \`_homepage_v_version_ai_labs_entries\`;`)
  await db.run(sql`DROP TABLE \`_homepage_v_version_industries_items\`;`)
  await db.run(sql`DROP TABLE \`_homepage_v\`;`)
  await db.run(sql`DROP TABLE \`site_settings_header_nav_links\`;`)
  await db.run(sql`DROP TABLE \`site_settings_footer_columns_links\`;`)
  await db.run(sql`DROP TABLE \`site_settings_footer_columns\`;`)
  await db.run(sql`DROP TABLE \`site_settings\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_version_header_nav_links\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_version_footer_columns_links\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_version_footer_columns\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v\`;`)
}
