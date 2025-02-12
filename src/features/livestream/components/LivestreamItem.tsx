import {
  ItemAction,
  ItemInfo,
  ListItemWithAvatar,
} from "@/src/shared/components/ListItemWithAvatar";
import { IMAGE_BASE_URL } from "@/src/shared/constants/base-paths";
import { PopulatedLivestream } from "@/src/shared/types/livestream.type";
import { Link } from "react-router-dom";

const LivestreamItem = ({
  livestream,
}: {
  livestream: PopulatedLivestream;
}) => {
  return (
    <Link to={`/livestream/${livestream._id}`}>
      <ListItemWithAvatar
        avatarSrc={IMAGE_BASE_URL + livestream.endUser.avatar}
        avatarFallback={livestream.title}
        className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 transition-all hover:border-red-300 hover:shadow-md"
      >
        <ItemInfo>
          <div className="flex flex-col gap-1">
            <h4 className="text-base font-semibold tracking-tight">
              {livestream.title}
            </h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
              {livestream.description}
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Streaming by {livestream.endUser.username}
            </p>
          </div>
        </ItemInfo>
        <ItemAction>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-500 text-xs font-medium uppercase tracking-wider">
                Live
              </span>
            </div>
          </div>
        </ItemAction>
      </ListItemWithAvatar>
    </Link>
  );
};

export default LivestreamItem;
