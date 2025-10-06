import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Car {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  brand!: string;

  @Column()
  model!: string;

  @Column()
  year!: number;

  @Column()
  engine!: string;

  @Column({ nullable: true })
  image?: string;

  @ManyToOne(() => User, user => user.cars, { onDelete: "CASCADE" })
  owner!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
