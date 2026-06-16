import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260616112637 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "ticket" ("id" text not null, "name" text not null, "price" integer not null, "available_quantity" integer not null, "visit_date" timestamptz not null, "status" text check ("status" in ('active', 'sold_out', 'cancelled')) not null default 'active', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "ticket_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_ticket_deleted_at" ON "ticket" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "ticket" cascade;`);
  }

}
