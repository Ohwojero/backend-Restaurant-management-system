import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm"
import { Location } from "../../locations/entities/location.entity"

@Entity("alerts")
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: "varchar", length: 255 })
  title: string

  @Column({ type: "text" })
  message: string

  @Column({ type: "varchar", length: 50, default: "warning" })
  severity: "info" | "warning" | "critical" | "error"

  @Column({ type: "varchar", length: 100 })
  type: string

  @Column({ type: "boolean", default: false })
  resolved: boolean

  @ManyToOne(
    () => Location,
    (location) => location.alerts,
    { onDelete: "CASCADE" },
  )
  location: Location

  @Column({ nullable: true })
  locationId: string

  @CreateDateColumn()
  createdAt: Date

  @Column({ type: "timestamp", nullable: true })
  resolvedAt: Date
}
