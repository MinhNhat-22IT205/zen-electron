import PostList from "../../post/components/post-list/RecommendatedPostList";
import FeedSearch from "./FeedSearch";
import AddPostButton from "../../post/components/add-post/AddPostButton";

const FeedPage = () => {
  return (
    <>
      <div className="flex w-full justify-between items-center">
        <FeedSearch />
        <AddPostButton />
      </div>
      <PostList />
    </>
  );
};

export default FeedPage;
