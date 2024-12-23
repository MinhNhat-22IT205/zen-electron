import React, { useState } from "react";
import { Input } from "@/src/shared/components/shadcn-ui/input";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import { useDraggable } from "../hooks/useDraggable";
import { usePomodoroStore } from "@/src/shared/libs/zustand/pomodoro-settings";

interface VideoItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    thumbnails: {
      default: {
        url: string;
      };
    };
  };
}

export const YouTubePopup: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<VideoItem[]>([]);
  const {
    youtubeVideoId,
    setYoutubeVideoId,
    youtubeVideoTitle,
    setYoutubeVideoTitle,
  } = usePomodoroStore();
  const { position } = useDraggable("youtube-popup");

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(
          searchQuery,
        )}&type=video&key=AIzaSyDjwmt1Z2Xzmiug5geit-Bw0cZUbyqySxk`,
      );
      const data = await response.json();
      setSearchResults(data.items);
      setYoutubeVideoId(""); // Clear current video when showing search results
    } catch (error) {
      console.error("Error searching YouTube:", error);
    }
  };

  const handleVideoSelect = (selectedVideoId: string) => {
    setYoutubeVideoId(selectedVideoId);
    setSearchResults([]); // Clear search results when video is selected
  };

  return (
    <div
      id="youtube-popup"
      className="absolute bg-white p-4 rounded-lg shadow-lg w-80"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: "move",
      }}
    >
      <div className="mb-4 text-center font-bold">YouTube Player</div>
      <div className="flex space-x-2 mb-4">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search YouTube"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {searchResults.length > 0 && (
        <div className="mb-4 max-h-60 overflow-y-auto">
          {searchResults.map((video) => (
            <div
              key={video.id.videoId}
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                handleVideoSelect(video.id.videoId);
                setYoutubeVideoTitle(video.snippet.title);
              }}
            >
              <img
                src={video.snippet.thumbnails.default.url}
                alt={video.snippet.title}
                className="w-20 h-auto mr-2"
              />
              <p className="text-sm">{video.snippet.title}</p>
            </div>
          ))}
        </div>
      )}

      {youtubeVideoId && (
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${youtubeVideoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
};
