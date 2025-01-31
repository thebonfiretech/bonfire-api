import fs from "fs/promises";
import multer from "multer";
import path from "path";

const ensureDirectoryExists = async (dirPath: string) => {
    try {
        await fs.access(dirPath);
    } catch {
        await fs.mkdir(dirPath, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            const uploadPath = path.resolve(__dirname, "../../cache/files");
            await ensureDirectoryExists(uploadPath);
            cb(null, uploadPath);
        } catch (error) {
            cb(error as Error, "");
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    limits: { fileSize: 15 * 1024 * 1024 },
    storage,
});

export default upload;