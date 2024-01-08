import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";

export default async (req, res) => {
  if (req.method === "POST") {
    const { url, format } = req.body;

    // Validate the URL
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ message: "Invalid URL" });
    }

    try {
      // Check if the format is MP4
      if (format === "mp4") {
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="video.mp4"'
        );
        res.setHeader("Content-Type", "video/mp4");

        // Select the highest quality video stream
        let stream = ytdl(url, {
          quality: "highestvideo", // Selects the highest quality video-only format
          filter: (format) => format.container === "mp4",
        });
        console.log("Stream is - ", stream);
        stream.pipe(res);
      } else if (format === "mp3") {
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="audio.mp3"'
        );
        res.setHeader("Content-Type", "audio/mp3");

        let stream = ytdl(url, {
          quality: "highestaudio",
          filter: "audioonly",
        });
        ffmpeg(stream)
          .audioBitrate(128)
          .toFormat("mp3")
          .pipe(res, { end: true });
      } else {
        // Handle MP3 or other formats
        res.status(400).json({ message: "Format not supported" });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Error downloading video" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export const config = {
  api: {
    responseLimit: "1024mb",
  },
};
