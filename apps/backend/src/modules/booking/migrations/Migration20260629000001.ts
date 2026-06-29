import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260629000001 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`
      create table if not exists "booking" (
        "id" text not null,
        "ticket_id" text not null,
        "ticket_name" text not null,
        "customer_id" text not null,
        "customer_email" text not null,
        "quantity" integer not null,
        "total_price" integer not null,
        "status" text check ("status" in ('pending', 'confirmed', 'cancelled')) not null default 'pending',
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "booking_pkey" primary key ("id")
      );
    `);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_booking_deleted_at" ON "booking" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_booking_customer_id" ON "booking" ("customer_id") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "booking" cascade;`);
  }

}
