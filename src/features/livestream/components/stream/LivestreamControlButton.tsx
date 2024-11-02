import React from "react";

const LivestreamControlButton = ({
  id,
  icon,
  active = false,
  onClick,
}: {
  id?: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      id={id}
      className={`p-3 rounded-lg ${
        active
          ? "bg-white text-black hover:bg-gray-100 hover:text-black"
          : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
      }`}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

export default LivestreamControlButton;
