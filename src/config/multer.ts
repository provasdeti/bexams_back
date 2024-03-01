import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import crypto from 'crypto';

interface MulterRequest extends Request {
  file: Express.Multer.File;
}

const storageConfig = multer.diskStorage({
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
});

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
    storage: storageConfig,
    limits: limits,
    fileFilter: fileFilter,
};
