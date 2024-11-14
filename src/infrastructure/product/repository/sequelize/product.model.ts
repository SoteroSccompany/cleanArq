import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";


@Table({
    tableName: 'products',
    timestamps: false //Se cria automaticamente os campos createdAt e updatedAt
})
export default class ProductModel extends Model {
    @PrimaryKey
    @Column
    declare id: string;

    @Column({ allowNull: false })
    declare name: string;

    @Column({ allowNull: false })
    declare price: number;


}