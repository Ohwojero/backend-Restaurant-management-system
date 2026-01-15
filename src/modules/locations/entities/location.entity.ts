import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { Item } from "../../items/entities/item.entity"
import { Alert } from "../../alerts/entities/alert.entity"

@Entity("locations")
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: "varchar", length: 255 })
  name: string

  @Column({ type: "varchar", length: 500 })
  address: string

  @Column({ type: "varchar", length: 50, default: "active" })
  status: "active" | "inactive"

  @Column({ type: "int", default: 0 })
  staffCount: number

  @Column({ type: "varchar", length: 100, nullable: true })
  city?: string

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  inventoryValue: number

  @OneToMany(
    () => Item,
    (item) => item.location,
  )
  items: Item[]

  @OneToMany(
    () => Alert,
    (alert) => alert.location,
  )
  alerts: Alert[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
