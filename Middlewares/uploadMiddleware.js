const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { ApiError } = require("../utils/ApiError");

// ============================================================
// Allowed MIME Types
// ============================================================
const IMAGE_MIME_TYPES = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
};

const VIDEO_MIME_TYPES = {
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "video/quicktime": ".mov",
};

const PDF_MIME_TYPES = {
    "application/pdf": ".pdf",
};

// ============================================================
// Directory Helpers
// ============================================================
const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// ============================================================
// Storage Factory
// ============================================================
const createStorage = (destPath, mimeTypes, errorMsg) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            ensureDir(destPath);
            cb(null, destPath);
        },
        filename: (req, file, cb) => {
            const ext = mimeTypes[file.mimetype];
            if (!ext) {
                return cb(new ApiError(errorMsg, 400), false);
            }
            const uniqueName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
            cb(null, uniqueName);
        },
    });
};

// ============================================================
// File Filters
// ============================================================
const createFilter = (mimeTypes, errorMsg) => {
    return (req, file, cb) => {
        if (mimeTypes[file.mimetype]) {
            return cb(null, true);
        }
        return cb(new ApiError(errorMsg, 400), false);
    };
};

const multiFilter = (mimeTypesArray, errorMsg) => {
    const allowed = Object.assign({}, ...mimeTypesArray);
    return (req, file, cb) => {
        if (allowed[file.mimetype]) {
            return cb(null, true);
        }
        return cb(new ApiError(errorMsg, 400), false);
    };
};

// ============================================================
// Uploaders
// ============================================================

// 1. Avatar Uploader
const uploadAvatar = multer({
    storage: createStorage("uploads/images/avatars", IMAGE_MIME_TYPES, "نوع الملف غير مدعوم — الصور المسموحة: jpg, png, webp"),
    fileFilter: createFilter(IMAGE_MIME_TYPES, "نوع الملف غير مدعوم — الصور المسموحة: jpg, png, webp"),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single("avatar");


// 2. Lesson Media Uploader (PDF, Video, Image)
const lessonMediaStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let destPath = "uploads/misc";
        if (IMAGE_MIME_TYPES[file.mimetype]) destPath = "uploads/images/lessons";
        else if (VIDEO_MIME_TYPES[file.mimetype]) destPath = "uploads/videos/lessons";
        else if (PDF_MIME_TYPES[file.mimetype]) destPath = "uploads/docs/lessons";

        ensureDir(destPath);
        cb(null, destPath);
    },
    filename: (req, file, cb) => {
        const ext = IMAGE_MIME_TYPES[file.mimetype] || VIDEO_MIME_TYPES[file.mimetype] || PDF_MIME_TYPES[file.mimetype];
        if (!ext) return cb(new ApiError("الملف غير مدعوم", 400), false);

        const uniqueName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
        cb(null, uniqueName);
    }
});

const uploadLessonMedia = multer({
    storage: lessonMediaStorage,
    fileFilter: multiFilter([IMAGE_MIME_TYPES, VIDEO_MIME_TYPES, PDF_MIME_TYPES], "أنواع الملفات المسموحة: صور (jpg,png,webp)، فيديو (mp4,webm,mov)، وملفات (pdf)"),
    limits: { fileSize: 500 * 1024 * 1024 }, // 500MB (For large videos)
}).fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
]);

module.exports = {
    uploadAvatar,
    uploadLessonMedia
};