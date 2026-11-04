import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`services_groups_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`ai_edge\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_groups\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_groups_services_order_idx\` ON \`services_groups_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_groups_services_parent_id_idx\` ON \`services_groups_services\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_groups\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`tag\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`tagline\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_groups_order_idx\` ON \`services_groups\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_groups_parent_id_idx\` ON \`services_groups\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`tag\` text,
  	\`heading\` text NOT NULL,
  	\`lede\` text,
  	\`closing_heading\` text,
  	\`closing_text\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`services_groups_services\`;`)
  await db.run(sql`DROP TABLE \`services_groups\`;`)
  await db.run(sql`DROP TABLE \`services\`;`)
}
