import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Product_urls } from "./ProductUrls";

@Entity()
export class Products {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    product_name!: string

    @OneToOne(() => Product_urls)
    @JoinColumn({ name: "product_url_id" })
    product_url_id!: Product_urls;

    @Column()
    brand_name!: string

    @Column()
    current_price!: string

    @Column()
    original_price!: string

    @Column({ nullable: true, default: null })
    description!: string

    @Column({ nullable: true, default: null })
    condition!: string;

    @Column({ nullable: true, default: null })
    size!: string;

    @Column({ nullable: true, default: null })
    Date_of_publish!: string;

    @Column({ nullable: true, default: null })
    Date_of_seen!: string;

    @Column({ nullable: true, default: null })
    Date_of_first_sold!: string;

    @Column({ nullable: true, default: null })
    items_sold!: number;

    @Column({ nullable: true, default: null })
    favourites!: number;

}