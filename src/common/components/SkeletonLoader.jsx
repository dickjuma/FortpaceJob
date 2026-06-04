import React from 'react';

export const ProfileSkeleton = () => (
  <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 w-full animate-pulse">
    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden mb-8">
      <div className="h-48 bg-gray-200 dark:bg-gray-800"></div>
      <div className="px-6 sm:px-10 pb-8">
        <div className="relative flex justify-between items-end -mt-16 mb-6">
          <div className="flex items-end space-x-5">
            <div className="w-32 h-32 rounded-2xl bg-gray-300 dark:bg-gray-700 border-4 border-white dark:border-gray-900"></div>
            <div className="pb-2 space-y-2">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </div>
          </div>
          <div className="pb-2 flex space-x-3">
            <div className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
            <div className="h-10 w-32 bg-[#2bb75c] dark:bg-[#2bb75c]/50 rounded-xl"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="space-y-3">
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded ml-auto"></div>
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded ml-auto"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const CardSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm animate-pulse">
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800"></div>
      <div className="space-y-2 flex-1">
        <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-800 rounded"></div>
      </div>
    </div>
    <div className="space-y-2 mt-4">
      <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
      <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-800 rounded"></div>
      <div className="h-3 w-4/6 bg-gray-200 dark:bg-gray-800 rounded"></div>
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 w-full">
    <div className="mb-8 space-y-2 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
      <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm animate-pulse h-32 flex flex-col justify-center space-y-3">
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {[1, 2, 3].map(i => <CardSkeleton key={`main-${i}`} />)}
      </div>
      <div className="space-y-6">
        {[1, 2].map(i => <CardSkeleton key={`side-${i}`} />)}
      </div>
    </div>
  </div>
);

