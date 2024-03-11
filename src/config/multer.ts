import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import multers3 from 'multer-s3';
import path from 'path';
import crypto from 'crypto';
import { S3Client } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
dotenv.config();

interface MulterFileWithKeyURL extends Express.Multer.File {
    key?: string;
    name?: string;    
    location?: string;
}

export interface MulterRequest extends Request {
    file: MulterFileWithKeyURL;
}

// Defina um tipo para as chaves de storageTypes
type StorageTypeKey = keyof typeof storageTypes;

// Aqui estamos assumindo que o valor de STORAGE_TYPE do ambiente vai ser 'local' ou 's3'
const storageType: StorageTypeKey = (process.env.STORAGE_TYPE as StorageTypeKey) || 'local';

const s3BucketName = process.env.S3_BUCKET_NAME;
const s3BucketRegion = process.env.S3_BUCKET_REGION;
const accessKeyId = process.env.S3_ACCESS_KEY;
const secretAccessKey = process.env.S3_SECRET_KEY;

const s3Client = new S3Client({
    region: s3BucketRegion,
    credentials: {
        accessKeyId: accessKeyId!,
        secretAccessKey: secretAccessKey!,
    }
});

if (!s3BucketName) {
    throw new Error('A variável de ambiente S3_BUCKET_NAME deve ser definida.');
}

if (!s3BucketRegion) {
    throw new Error('A variável de ambiente S3_BUCKET_REGION deve ser definida.');
}


const storageTypes = {
    local: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
        },
        filename: (req: MulterRequest, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) return cb(err, '');
                const fileName = `${hash.toString('hex')}-${file.originalname}`;
                cb(null, fileName);
            });
        },
    }),
    s3: multers3({
        s3: s3Client,
        bucket: s3BucketName,
        contentType: multers3.AUTO_CONTENT_TYPE,
        //acl: 'public-read',
        key: (req: MulterRequest, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err);
                else {
                    const fileName = `img/${hash.toString('hex')}-${file.originalname}`;
                    cb(null, fileName);
                }
            });
        },
    })
};


const limits = {
    fileSize: 2 * 1024 * 1024, // 2MB
};

const fileFilter = (req: MulterRequest, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedMimes = [
        'image/jpeg',
        'image/pjpeg',
        'image/png',
        'image/gif',
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type.'));
    }
};

export default {
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    storage: storageTypes[storageType],
    limits: limits,
    fileFilter: fileFilter,
};