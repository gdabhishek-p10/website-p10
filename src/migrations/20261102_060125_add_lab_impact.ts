import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`homepage_ai_labs_entries_metrics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text DEFAULT 'chart',
  	\`label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage_ai_labs_entries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_ai_labs_entries_metrics_order_idx\` ON \`homepage_ai_labs_entries_metrics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_ai_labs_entries_metrics_parent_id_idx\` ON \`homepage_ai_labs_entries_metrics\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_homepage_v_version_ai_labs_entries_metrics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon\` text DEFAULT 'chart',
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_homepage_v_version_ai_labs_entries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_ai_labs_entries_metrics_order_idx\` ON \`_homepage_v_version_ai_labs_entries_metrics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_ai_labs_entries_metrics_parent_id_idx\` ON \`_homepage_v_version_ai_labs_entries_metrics\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`homepage_ai_labs_entries\` ADD \`impact_label\` text;`)
  await db.run(sql`ALTER TABLE \`homepage_ai_labs_entries\` ADD \`impact_headline\` text;`)
  await db.run(sql`ALTER TABLE \`_homepage_v_version_ai_labs_entries\` ADD \`impact_label\` text;`)
  await db.run(sql`ALTER TABLE \`_homepage_v_version_ai_labs_entries\` ADD \`impact_headline\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`homepage_ai_labs_entries_metrics\`;`)
  await db.run(sql`DROP TABLE \`_homepage_v_version_ai_labs_entries_metrics\`;`)
  await db.run(sql`ALTER TABLE \`homepage_ai_labs_entries\` DROP COLUMN \`impact_label\`;`)
  await db.run(sql`ALTER TABLE \`homepage_ai_labs_entries\` DROP COLUMN \`impact_headline\`;`)
  await db.run(sql`ALTER TABLE \`_homepage_v_version_ai_labs_entries\` DROP COLUMN \`impact_label\`;`)
  await db.run(sql`ALTER TABLE \`_homepage_v_version_ai_labs_entries\` DROP COLUMN \`impact_headline\`;`)
}
