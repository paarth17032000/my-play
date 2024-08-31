import React from "react";

function SkeletonLoader() {
  return (
    <div className="flex items-center col-span-1 justify-between p-4 rounded-[8px] my-1 bg-[#FFFFFF14] animate-pulse">
      <div className="flex items-center gap-4">
        <div className="rounded-full h-12 w-12 bg-gray-600"></div>
        <div className="flex flex-col space-y-2">
          <div className="w-32 h-5 bg-gray-600 rounded"></div>
          <div className="w-24 h-4 bg-gray-600 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default function SkeletonLoaderComponent() {
  return (
    <>
      <SkeletonLoader />
      <SkeletonLoader />
      <SkeletonLoader />
      <SkeletonLoader />
      <SkeletonLoader />
      <SkeletonLoader />
      <SkeletonLoader />
      <SkeletonLoader />
    </>
  );
}
