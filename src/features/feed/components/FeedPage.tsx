import AddFeedButton from "./AddFeedButton";
import Feed from "./Feed";
import FeedList from "./FeedList";
import FeedSearch from "./FeedSearch";
import RightSidebar from "./RightSidebar";

const FeedPage = () => {
  return (
    <>
      <div className="flex w-full justify-between items-center">
        <FeedSearch />
        <AddFeedButton />
      </div>
      <FeedList />
    </>
  );
};

export default FeedPage;
