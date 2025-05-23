'use client';

interface TruncatedTextProps {
  text: string;
  length?: number;
}

export default function TruncatedText ({ text, length }: TruncatedTextProps) {
  const maxLength = length || 20;
  const truncated = text.length > 20 ? text.slice(0, maxLength) + '…' : text;

  return (
    <span title={text} className="cursor-help">
      {truncated}
    </span>
  );
};
