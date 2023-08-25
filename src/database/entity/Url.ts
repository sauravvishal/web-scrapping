import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Urls {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    website_name!: string

    @Column('text', { array: true, nullable: true })
    urls!: string[];

}