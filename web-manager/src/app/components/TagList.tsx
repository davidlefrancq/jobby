'use client';

interface TagListProps {
  tags: string[] | null | undefined;
}

export default function TagList({ tags }: TagListProps) {
  if (!tags || tags.length === 0) {
    return <span className="text-gray-500">
      {'[N/A]'}
    </span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
}