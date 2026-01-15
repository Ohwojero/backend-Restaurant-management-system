import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { Location } from "../../locations/entities/location.entity"

@Entity("items")
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: "varchar", length: 255 })
  name: string

  @Column({ type: "varchar", length: 100, unique: true })
  sku: string

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ type: "int" })
  quantity: number

  @Column({ type: "int" })
  reorderLevel: number

  @Column({ type: "int" })
  reorderQuantity: number

  @Column({ type: "decimal", precision: 10, scale: 2 })
  unitPrice: number

  @Column({ type: "varchar", length: 50 })
  unit: string

  @Column({ type: "varchar", length: 100 })
  supplier: string

  @Column({ type: "date" })
  expiryDate: Date

  @Column({ type: "varchar", length: 50, default: "good" })
  status: "good" | "warning" | "critical"

  @Column({ type: "varchar", length: 50, default: "active" })
  category: string

  @ManyToOne(
    () => Location,
    (location) => location.items,
    { onDelete: "CASCADE" },
  )
  location: Location

  @Column({ nullable: true })
  locationId: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
