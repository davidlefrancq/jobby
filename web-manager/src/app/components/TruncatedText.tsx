'use client';

interface TruncatedTextProps {
  text: string;
}

export default function TruncatedText ({ text }: TruncatedTextProps) {
  const truncated = text.length > 20 ? text.slice(0, 20) + '…' : text;

  return (
    <span title={text} className="cursor-help">
      {truncated}
    </span>
  );
};
