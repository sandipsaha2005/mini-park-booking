import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260629102616 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "ticket" drop constraint if exists "ticket_directus_id_unique";`);
    this.addSql(`alter table if exists "ticket" drop column if exists "visit_date";`);

    this.addSql(`alter table if exists "ticket" add column if not exists "directus_id" text not null, add column if not exists "park_ids" jsonb not null default '[]', add column if not exists "ticket_type" text check ("ticket_type" in ('single', 'combo')) not null default 'single';`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_ticket_directus_id_unique" ON "ticket" ("directus_id") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop index if exists "IDX_ticket_directus_id_unique";`);
    this.addSql(`alter table if exists "ticket" drop column if exists "directus_id", drop column if exists "park_ids", drop column if exists "ticket_type";`);

    this.addSql(`alter table if exists "ticket" add column if not exists "visit_date" timestamptz not null;`);
  }

}
