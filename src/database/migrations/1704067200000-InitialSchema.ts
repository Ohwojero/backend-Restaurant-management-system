import { type MigrationInterface, type QueryRunner, Table, TableForeignKey } from "typeorm"

export class InitialSchema1704067200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Users table
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "email",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "password",
            type: "varchar",
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      }),
    )

    // Locations table
    await queryRunner.createTable(
      new Table({
        name: "locations",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "name",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "address",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "staff_count",
            type: "int",
            default: 0,
          },
          {
            name: "status",
            type: "enum",
            enum: ["active", "inactive", "maintenance"],
            default: "'active'",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      }),
    )

    // Items table
    await queryRunner.createTable(
      new Table({
        name: "items",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "name",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "sku",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "quantity",
            type: "decimal",
            precision: 10,
            scale: 2,
          },
          {
            name: "unit",
            type: "varchar",
          },
          {
            name: "supplier",
            type: "varchar",
          },
          {
            name: "cost",
            type: "decimal",
            precision: 10,
            scale: 2,
          },
          {
            name: "selling_price",
            type: "decimal",
            precision: 10,
            scale: 2,
          },
          {
            name: "reorder_level",
            type: "decimal",
            precision: 10,
            scale: 2,
          },
          {
            name: "expiry_date",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "category",
            type: "varchar",
          },
          {
            name: "location_id",
            type: "uuid",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      }),
    )

    // Alerts table
    await queryRunner.createTable(
      new Table({
        name: "alerts",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "title",
            type: "varchar",
          },
          {
            name: "message",
            type: "text",
          },
          {
            name: "type",
            type: "enum",
            enum: ["warning", "critical", "info", "expiry"],
          },
          {
            name: "severity",
            type: "enum",
            enum: ["low", "medium", "high", "critical"],
          },
          {
            name: "resolved",
            type: "boolean",
            default: false,
          },
          {
            name: "item_id",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      }),
    )

    // Foreign key: Items -> Locations
    await queryRunner.createForeignKey(
      "items",
      new TableForeignKey({
        columnNames: ["location_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "locations",
        onDelete: "CASCADE",
      }),
    )

    // Foreign key: Alerts -> Items
    await queryRunner.createForeignKey(
      "alerts",
      new TableForeignKey({
        columnNames: ["item_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "items",
        onDelete: "SET NULL",
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("alerts")
    await queryRunner.dropTable("items")
    await queryRunner.dropTable("locations")
    await queryRunner.dropTable("users")
  }
}
