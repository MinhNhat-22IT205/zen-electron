import React from "react";

type FeedImagesProps = {
  images: string[];
};
const FeedImages = ({ images }: FeedImagesProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {images.map((src, index) => (
        <img
          key={index}
          src={"http://localhost:3001/uploads/" + src}
          alt={`Feed Image ${index + 1}`}
          className="w-full h-40 object-cover rounded-md"
        />
      ))}
    </div>
  );
};

export default FeedImages;
