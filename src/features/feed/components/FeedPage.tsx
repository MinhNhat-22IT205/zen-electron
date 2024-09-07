import AddFeedButton from "./AddFeedButton";
import Feed from "./Feed";
import FeedList from "./FeedList";
import FeedSearch from "./FeedSearch";
import RightSidebar from "./RightSidebar";

const FeedPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <FeedSearch />
        <AddFeedButton />
      </div>
      <FeedList />
    </div>
  );
};

export default FeedPage;
