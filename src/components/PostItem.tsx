interface PostItemProps {
  post: {
    id: number;
    content: string;
    createdAt: Date;
  };
  index: number;
}

export default function PostItem({ post, index }: PostItemProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-baseline mb-2 text-sm text-gray-500">
        <span className="font-bold mr-2">{index + 1}:</span>
        <span>投稿日時: {new Date(post.createdAt).toLocaleString("ja-JP")}</span>
      </div>
      <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
    </div>
  );
}
