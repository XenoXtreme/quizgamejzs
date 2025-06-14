"use client";
import React from "react";

// CONTEXT
import { ContextType } from "@/context/auth/context";
import { useAuthContext } from "@/context/auth/state";

export default function Logged() {
  const { team }: ContextType = useAuthContext();

  // Helper function to check if a member has data
  const hasMemberData = (memberKey: 'member1' | 'member2' | 'member3' | 'member4') => {
    return team?.member?.[memberKey]?.name && team?.member?.[memberKey]?.name !== '';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors">
      <div className="container max-w-3xl mx-auto px-4">
        {/* Team Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors">
          {/* Header */}
          <div className="relative">
            <div className="h-36 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <h1 className="text-white text-3xl font-bold tracking-wide z-10 text-center px-4">
                {team?.team || "Team Dashboard"}
              </h1>
            </div>
            {/* School Badge */}
            <div className="absolute -bottom-12 inset-x-0 flex justify-center">
              <div className="bg-white dark:bg-gray-900 rounded-full h-24 w-24 border-4 border-gray-100 dark:border-gray-800 shadow-md flex items-center justify-center overflow-hidden">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-300 text-center">
                  {team?.school?.substring(0, 2).toUpperCase() || "QD"}
                </div>
              </div>
            </div>
          </div>
          
          {/* Team Info */}
          <div className="pt-16 pb-8 px-6">
            <div className="text-center mb-6">
              <h2 className="text-gray-700 dark:text-gray-200 text-lg font-medium">
                {team?.school || "School Name"}
              </h2>
              <div className="flex items-center justify-center mt-2 space-x-2">
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 rounded-full text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                  {team?.category || "Category"}
                </span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-300 font-medium">
                  ID: {team?.id || "N/A"}
                </span>
              </div>
            </div>
            
            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-gray-200 dark:bg-gray-700"></div>
              <div className="px-4 text-base font-semibold text-indigo-500 dark:text-indigo-300">Team Members</div>
              <div className="flex-grow h-px bg-gray-200 dark:bg-gray-700"></div>
            </div>
            
            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['member1', 'member2', 'member3', 'member4'].map((memberKey, index) => (
                <div 
                  key={memberKey} 
                  className={`bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
                    hasMemberData(memberKey as 'member1' | 'member2' | 'member3' | 'member4') 
                      ? 'hover:border-indigo-400 dark:hover:border-indigo-500' 
                      : 'opacity-60'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-3">
                      <span className="text-base font-bold text-indigo-600 dark:text-indigo-300">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 dark:text-white text-base font-semibold mb-0.5">
                        {team?.member?.[memberKey as 'member1' | 'member2' | 'member3' | 'member4']?.name || "Not Assigned"}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        Class: {team?.member?.[memberKey as 'member1' | 'member2' | 'member3' | 'member4']?.class || "N/A"}
                        {team?.role && (
                          <>
                            <span className="mx-2 h-1 w-1 rounded-full bg-gray-400 dark:bg-gray-600"></span>
                            <span className="text-indigo-500 dark:text-indigo-300 font-medium">
                              {team?.role}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-10 text-center">
              <span className="text-gray-400 dark:text-gray-500 text-xs tracking-wider font-medium">
                QUIZDOM TEAM PORTAL
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}