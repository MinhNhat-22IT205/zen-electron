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
        className="border border-red-200 transition-all hover:border-red-300"
      >
        <ItemInfo>
          <h4 className="text-sm font-semibold">{livestream.title}</h4>{" "}
          <p className="text-sm">{livestream.description}</p>
        </ItemInfo>
        <ItemAction>
          <div className=" rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
            LIVE
          </div>
        </ItemAction>
      </ListItemWithAvatar>
    </Link>
  );
};

export default LivestreamItem;
