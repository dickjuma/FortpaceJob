import React from 'react';

function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

export function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800', className)}
      {...props}
    />
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-3', i === lines - 1 ? 'w-2/3' : 'w-full')}
        />
      ))}
    </div>
  );
}

export function FreelancerCardSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 p-6 space-y-4 bg-white dark:bg-zinc-800">
      <div className="flex gap-3">
        <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
      <Skeleton className="h-2 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-lg" />
        <Skeleton className="h-6 w-20 rounded-lg" />
        <Skeleton className="h-6 w-14 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-14 rounded-xl" />
        <Skeleton className="h-14 rounded-xl" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="flex flex-col items-center p-4 rounded-2xl border border-zinc-100 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/80">
      <Skeleton className="w-5 h-5 mb-2 rounded" />
      <Skeleton className="h-7 w-16 mb-1" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

export function CategoryPillSkeleton() {
  return <Skeleton className="h-10 w-28 rounded-full" />;
}

export function TestimonialSkeleton() {
  return (
    <div className="rounded-3xl border border-zinc-200 dark:border-zinc-700 p-10 bg-white dark:bg-zinc-800">
      <div className="flex flex-col sm:flex-row gap-8">
        <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-8 w-32 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
