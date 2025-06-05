'use client';

interface IDisplayBannerProps {
  value: string;
}

export default function DisplayBanner({ value }: IDisplayBannerProps) {
  return (
    <div className="absolute flex top-18 right-3 z-50 text-sm text-gray-500">
      <div className="w-37 text-center text-xs ms-1 bg-gray-100 text-gray-800 px-2 py-1 my-1 rounded-full">
        {value}
      </div>
    </div>
  );
}