"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useEntries } from "@/hooks/useEntries";
import { StatsCard } from "@/components/entries/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, XCircle, Clock, TrendingUp, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { isManager, user } = useAuth();
  const { stats, fetchEntries } = useEntries();

  const navigateToEntries = useCallback(() => {
    router.push('/dashboard/entries');
  }, [router]);

  const navigateToCreateManager = useCallback(() => {
    router.push('/dashboard/create-manager');
  }, [router]);

  useEffect(() => {
    fetchEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl shadow-elegant p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">
              Welcome back, {user?.email?.split('@')[0]}! 👋
            </h1>
            <p className="text-purple-100 text-lg">
              {isManager 
                ? "Monitor and manage all entries from your team" 
                : "Track your entries and their approval status"}
            </p>
          </div>
          <Button 
            onClick={navigateToEntries}
            className="bg-white text-purple-700 hover:bg-purple-50 font-semibold px-6 h-12 shadow-lg"
          >
            View All Entries
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-purple-600" />
          Overview Statistics
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Entries"
            value={stats.total}
            icon={FileText}
            gradient="from-blue-500 to-blue-700"
            description="All entries"
          />
          <StatsCard
            title="Pending"
            value={stats.pending}
            icon={Clock}
            gradient="from-amber-500 to-orange-600"
            description="Awaiting review"
          />
          <StatsCard
            title="Approved"
            value={stats.approved}
            icon={CheckCircle}
            gradient="from-emerald-500 to-green-700"
            description="Accepted"
          />
          <StatsCard
            title="Rejected"
            value={stats.rejected}
            icon={XCircle}
            gradient="from-red-500 to-rose-700"
            description="Declined"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card 
            className="shadow-smooth border-0 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 cursor-pointer" 
            onClick={navigateToEntries}
          >
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-2">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">
                {isManager ? "All Entries" : "My Entries"}
              </CardTitle>
              <CardDescription className="text-base">
                {isManager ? "View and manage all entries" : "View and manage your entries"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-between group">
                Go to Entries
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {isManager && (
            <Card 
              className="shadow-smooth border-0 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 cursor-pointer" 
              onClick={navigateToCreateManager}
            >
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mb-2">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <CardTitle className="text-xl">Create Manager</CardTitle>
                <CardDescription className="text-base">
                  Add a new manager account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-between group">
                  Create Manager
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-smooth border-0 bg-gradient-to-br from-purple-50 to-blue-50">
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">Activity</CardTitle>
              <CardDescription className="text-base">
                {isManager ? "System-wide activity" : "Your recent activity"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Approval Rate</span>
                  <span className="font-bold text-green-600">
                    {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Pending Items</span>
                  <span className="font-bold text-amber-600">{stats.pending}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
