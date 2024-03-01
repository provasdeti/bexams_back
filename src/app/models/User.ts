import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('usuarios')
class Usuario {

    @PrimaryGeneratedColumn('uuid')
    id!: string; 

    @Column()
    nome!: string; 

    @Column({ unique: true })
    email!: string; 
}

export default Usuario;