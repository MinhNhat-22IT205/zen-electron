import PostList from "../../post/components/post-list/RecommendatedPostList";
import FeedSearch from "./FeedSearch";
import AddPostButton from "../../post/components/add-post/AddPostButton";

const FeedPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="sticky top-0 z-10 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 mb-6 rounded-xl shadow-sm">
        <div className="flex w-full justify-between items-center p-4">
          <FeedSearch />
          <AddPostButton />
        </div>
      </div>
      <PostList />
    </div>
  );
};

export default FeedPage;
