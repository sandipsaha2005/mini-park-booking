import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260623061201 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "park" drop constraint if exists "park_directus_id_unique";`);
    this.addSql(`create table if not exists "park" ("id" text not null, "directus_id" text not null, "name" text not null, "description" text null, "image_url" text null, "status" text check ("status" in ('published', 'draft')) not null default 'draft', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "park_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_park_directus_id_unique" ON "park" ("directus_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_park_deleted_at" ON "park" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "park" cascade;`);
  }

}
