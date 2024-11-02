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
      <div className="border-2 border-red-400 p-0.5 rounded-lg">
        <ListItemWithAvatar
          avatarSrc={IMAGE_BASE_URL + livestream.endUser.avatar}
          avatarFallback={livestream.title}
        >
          <ItemInfo>
            <h4 className="text-sm font-semibold">{livestream.title}</h4>{" "}
            <p className="text-sm">{livestream.description}</p>
          </ItemInfo>
          <ItemAction>
            <></>
          </ItemAction>
        </ListItemWithAvatar>
      </div>
    </Link>
  );
};

export default LivestreamItem;
