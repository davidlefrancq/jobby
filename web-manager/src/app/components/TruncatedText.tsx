'use client';

interface TruncatedTextProps {
  text: string;
  length?: number;
}

export default function TruncatedText ({ text, length }: TruncatedTextProps) {
  const maxLength = length || 20;
  const truncated = text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
  const isTruncated = text.length > maxLength;

  let className = '';
  if (isTruncated) className += 'cursor-help'
  return (
    <span title={isTruncated ? text : undefined} className={className}>
      {truncated}
    </span>
  );
};
