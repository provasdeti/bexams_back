import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, VersionColumn, BeforeInsert } from "typeorm";
import dotenv from 'dotenv';
dotenv.config();

const localAppUrl = process.env.APP_URL;

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

    @VersionColumn()
    version!: number;

    @BeforeInsert()
    checkURL() {
        if (!this.url) {
            // Atribuir um valor padrão para url
            this.url = `${localAppUrl}/files/${this.key}`;
        }
    }
}

export default Imagem;