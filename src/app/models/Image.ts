import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity('imagens')
class Imagem {

    @PrimaryGeneratedColumn('uuid')
    id!: string; 

    @Column()
    name!: string; 

    @Column()
    size!: number; 

    @Column({ unique: true })
    key!: string; 

    @Column()
    url!: string; 

    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date;
}

export default Imagem;