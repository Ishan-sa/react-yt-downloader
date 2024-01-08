import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState("mp4");
  const [videoInfo, setVideoInfo] = useState(null);

  const handleUrlChange = async (e) => {
    setUrl(e.target.value);

    const videoIdRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = e.target.value.match(videoIdRegex);

    if (match && match[1]) {
      const videoId = match[1];

      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      setVideoInfo({ embedUrl });
    } else {
      setVideoInfo(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/download", {
        method: "POST",
        body: JSON.stringify({ url, format }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `video.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={url}
            onChange={handleUrlChange}
            className="w-full p-2 border border-gray-300 rounded text-gray-800 focus:outline-none focus:border-blue-500"
            placeholder="Enter YouTube URL"
          />
          <div>
            <label>
              <input
                type="radio"
                name="format"
                value="mp4"
                checked={format === "mp4"}
                onChange={() => setFormat("mp4")}
              />
              MP4
            </label>
            <label>
              <input
                type="radio"
                name="format"
                value="mp3"
                checked={format === "mp3"}
                onChange={() => setFormat("mp3")}
              />
              MP3
            </label>
          </div>
          {/* Video preview component (implement this) */}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Download
          </button>
        </form>
        {videoInfo && (
          <div className="mt-4">
            <iframe
              width="560"
              height="315"
              src={videoInfo.embedUrl}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
        <p className="my-8">Made by Ishan</p>
      </div>
    </>
  );
}
