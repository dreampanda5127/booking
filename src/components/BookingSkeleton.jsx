import React from 'react';
import { Spinner } from 'flowbite-react';

export default function BookingSkeleton() {
  return (
    <main className="min-h-screen bg-white py-6 sm:py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-[1380px] bg-[#f6f8f7] rounded-3xl shadow-sm border border-gray-200/80 p-4 sm:p-6 lg:p-8 transition-all animate-pulse">
        <div className="flex justify-between max-lg:flex-col gap-8 lg:gap-10">
          
          {/* Left Column Skeleton */}
          <div className="flex-grow border-b lg:border-b-0 lg:border-r border-gray-200 pb-6 lg:pb-0 lg:pr-8 flex flex-col justify-between">
            <div>
              {/* Title Skeleton */}
              <div className="h-9 bg-gray-200 rounded-xl w-3/4 mb-6"></div>

              {/* Info Rows */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-36"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-28"></div>
                </div>
              </div>
            </div>

            {/* Illustration Placeholder */}
            <div className="my-6 p-8 bg-white/70 rounded-2xl border border-gray-200 flex flex-col items-center justify-center text-center">
              <Spinner size="md" className="mb-3 text-[#0a4b37]" />
              <span className="text-xs sm:text-sm font-semibold text-gray-700">
                Verifying your invitation details...
              </span>
              <span className="text-[11px] text-gray-400 mt-0.5">
                Connecting to NexTech scheduling system
              </span>
            </div>

            {/* Selection Status Box Skeleton */}
            <div className="mt-2 p-4 bg-white/60 border border-gray-200 rounded-xl space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="max-lg:w-full lg:max-w-[768px] flex flex-col justify-between">
            <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="h-5 bg-gray-200 rounded w-28"></div>
                <div className="flex gap-1.5">
                  <div className="w-7 h-7 bg-gray-200 rounded-full"></div>
                  <div className="w-7 h-7 bg-gray-200 rounded-full"></div>
                </div>
              </div>

              {/* Calendar Grid Skeleton */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="h-8 w-8 mx-auto bg-gray-100 rounded-lg"></div>
                ))}
              </div>

              <div className="h-8 bg-gray-100 rounded-lg w-full mt-3"></div>
            </div>

            {/* Form Skeleton */}
            <div className="mt-3 bg-white rounded-xl shadow-sm p-5 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="h-9 bg-gray-100 rounded-lg"></div>
                <div className="h-9 bg-gray-100 rounded-lg"></div>
              </div>
              <div className="h-16 bg-gray-100 rounded-lg"></div>
              <div className="h-9 bg-gray-200 rounded-lg w-40 ml-auto"></div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
