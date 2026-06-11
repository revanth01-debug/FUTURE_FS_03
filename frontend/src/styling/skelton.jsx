// SkeletonCard.jsx
export const SkeletonCard=()=> {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow p-4">
      <div className="bg-gray-300 h-40 w-full rounded-md"></div>
      <div className="mt-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 rounded w-4/6"></div>
      </div>
    </div>
  );
}

export const SkeletonButton=()=> {
  return (
    <div className="animate-pulse bg-gray-300 h-10 min-w-[150px] rounded-md "></div>
  )
}