const FeedSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Header skeleton */}
      <div className="bg-base-200 rounded-lg p-4 space-y-3">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-full bg-base-300" />
          <div className="space-y-2 flex-1">
            <div className="h-3 w-1/3 bg-base-300 rounded" />
            <div className="h-2 w-1/4 bg-base-300 rounded" />
          </div>
        </div>

        <div className="h-4 w-3/4 bg-base-300 rounded" />
        <div className="h-3 w-full bg-base-300 rounded" />
        <div className="h-3 w-2/3 bg-base-300 rounded" />
      </div>

      {/* Feed cards skeleton */}
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="bg-base-200 rounded-lg p-4 space-y-3"
        >
          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-base-300" />
            <div className="space-y-2 flex-1">
              <div className="h-3 w-1/4 bg-base-300 rounded" />
              <div className="h-2 w-1/3 bg-base-300 rounded" />
            </div>
          </div>

          {/* Question */}
          <div className="h-4 w-3/4 bg-base-300 rounded" />
          <div className="h-3 w-full bg-base-300 rounded" />
          <div className="h-3 w-5/6 bg-base-300 rounded" />

          {/* Tags */}
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-base-300 rounded-full" />
            <div className="h-6 w-20 bg-base-300 rounded-full" />
            <div className="h-6 w-14 bg-base-300 rounded-full" />
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-2">
            <div className="flex gap-3">
              <div className="h-6 w-10 bg-base-300 rounded" />
              <div className="h-6 w-10 bg-base-300 rounded" />
              <div className="h-6 w-10 bg-base-300 rounded" />
            </div>

            <div className="flex gap-2">
              <div className="h-6 w-6 bg-base-300 rounded" />
              <div className="h-6 w-6 bg-base-300 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedSkeleton;