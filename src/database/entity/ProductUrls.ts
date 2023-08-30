import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from "typeorm";
import { Urls } from "./Url";

@Entity()
export class Product_urls {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    product_name!: string

    @Column()
    url!: string;

    @Column()
    page!: number;

    @ManyToOne(() => Urls)
    @JoinColumn({ name: "url_id" })
    url_id!: Urls;

}