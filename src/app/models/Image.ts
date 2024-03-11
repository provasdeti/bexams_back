import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, VersionColumn, BeforeInsert, BeforeRemove } from "typeorm";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';
dotenv.config();

const localAppUrl = process.env.APP_URL;

let s3Client: S3Client | null = null;
if (process.env.STORAGE_TYPE === 's3') {
  s3Client = new S3Client({
    region: process.env.S3_BUCKET_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY!,
      secretAccessKey: process.env.S3_SECRET_KEY!,
    }
  });
}

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

    @BeforeRemove()
    async deleteFile() {
      if (process.env.STORAGE_TYPE === 's3' && this.key && s3Client) {
        try {
          const deleteParams = {
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: `img/${this.key}`,
          };
          await s3Client.send(new DeleteObjectCommand(deleteParams));
        } catch (error) {
          console.error("Erro ao deletar imagem do S3:", error);
          throw new Error("Erro ao deletar imagem do S3");
        }
      } else if (process.env.STORAGE_TYPE === 'local' && this.key) {
        try {
          const filePath = path.resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', this.key);
          console.log(filePath);
          await fs.unlink(filePath);
        } catch (error) {
          console.error("Erro ao deletar arquivo local:", error);
          throw new Error("Erro ao deletar arquivo local");
        }
      }
    }
}

export default Imagem;