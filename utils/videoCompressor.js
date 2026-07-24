const ffmpeg = require("fluent-ffmpeg");
const ffmpegStatic = require("ffmpeg-static");
const ffprobeStatic = require("ffprobe-static");
const path = require("path");
const fs = require("fs");
const { ApiError } = require("./ApiError");

ffmpeg.setFfmpegPath(ffmpegStatic);
ffmpeg.setFfprobePath(ffprobeStatic.path);

/**
 * @param {string} inputPath
 * @returns {Promise<string>}
 */
const processVideo = (inputPath) => {
    return new Promise((resolve, reject) => {
        console.log("🎬 بدء فحص الفيديو");

        ffmpeg.ffprobe(inputPath, (err, metadata) => {
            if (err) {
                console.error("❌ ffprobe error:", err);
                if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
                return reject(new ApiError("فشل في قراءة بيانات الفيديو", 400));
            }

            const duration = metadata.format.duration;
            console.log("⏱ مدة الفيديو:", duration);

            if (duration > 3600) {
                if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
                return reject(
                    new ApiError(`مدة الفيديو ${Math.round(duration)} ثانية. الحد الأقصى 60 دقيقة`, 400)
                );
            }

            const ext = path.extname(inputPath);
            const dir = path.dirname(inputPath);
            const basename = path.basename(inputPath, ext);
            const outputPath = path.join(dir, `${basename}-compressed${ext}`);

            console.log("🚀 بدء الضغط...");

            ffmpeg(inputPath)
                .outputOptions([
                    "-vcodec libx264",
                    "-crf 28",
                    "-preset ultrafast",
                    "-movflags +faststart",
                ])
                .on("start", (cmd) => {
                    console.log("📢 FFmpeg command:", cmd);
                })
                .on("end", () => {
                    console.log("✅ انتهى الضغط");

                    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
                    fs.renameSync(outputPath, inputPath);

                    resolve(inputPath);
                })
                .on("error", (err) => {
                    console.error("❌ ffmpeg error:", err);

                    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
                    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);

                    reject(new ApiError("خطأ أثناء معالجة الفيديو", 500));
                })
                .save(outputPath);
        });
    });
};

module.exports = { processVideo };