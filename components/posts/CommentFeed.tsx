import usePosts from "@/hooks/usePosts";
import PostItem from "./PostItem";
import CommentItem from "./CommentItem";

interface CommentFeedProps {
  comments?: Record<string,any>[];
}
const CommentFeed: React.FC<CommentFeedProps> = ({ comments = []}) => {
  return (
    <div className="border-b-[1px] border-neutral-800 px-5 py-2">
    {comments.map((comment: Record<string,any>)=> (
        <CommentItem key={comment.id} data={comment} />
    ))}
    </div>
  );
};

export default CommentFeed;
