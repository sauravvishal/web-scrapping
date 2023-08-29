import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Product_urls {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    website_name!: string

    @Column()
    url!: string;

    @Column()
    page!: number;

}