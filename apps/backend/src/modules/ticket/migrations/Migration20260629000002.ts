import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260629000002 extends Migration {

  override async up(): Promise<void> {
    // Add directus_id if it doesn't exist (was added in a previous uncommitted change)
    this.addSql(`ALTER TABLE "ticket" ADD COLUMN IF NOT EXISTS "directus_id" text;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_ticket_directus_id" ON "ticket" ("directus_id") WHERE deleted_at IS NULL;`);
    // Add new fields
    this.addSql(`ALTER TABLE "ticket" ADD COLUMN IF NOT EXISTS "park_ids" jsonb not null default '[]';`);
    this.addSql(`ALTER TABLE "ticket" ADD COLUMN IF NOT EXISTS "ticket_type" text check ("ticket_type" in ('single', 'combo')) not null default 'single';`);
  }

  override async down(): Promise<void> {
    this.addSql(`ALTER TABLE "ticket" DROP COLUMN IF EXISTS "park_ids";`);
    this.addSql(`ALTER TABLE "ticket" DROP COLUMN IF EXISTS "ticket_type";`);
    this.addSql(`DROP INDEX IF EXISTS "IDX_ticket_directus_id";`);
    this.addSql(`ALTER TABLE "ticket" DROP COLUMN IF EXISTS "directus_id";`);
  }

}
