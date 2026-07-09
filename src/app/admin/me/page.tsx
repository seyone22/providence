"use client";

import { ArrowUpRight, Briefcase, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboardData } from "@/actions/dashboard-actions";

export default function OperationsOverviewDashboard() {
  const [timeframe, setTimeframe] = useState("month");
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const res = await getDashboardData();
      if (res.success) {
        setDashboardData(res.data);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-zinc-400" size={40} />
      </div>
    );
  }

  // Mapping pipeline stages for the Funnel Velocity Bar
  const pipelineVelocity = [
    {
      stage: "New",
      count: dashboardData?.pipelineStages?.New || 0,
      color: "bg-zinc-900",
    },
    {
      stage: "Vehicle Selection",
      count: dashboardData?.pipelineStages?.["Vehicle Selection"] || 0,
      color: "bg-zinc-700",
    },
    {
      stage: "Shipped",
      count: dashboardData?.pipelineStages?.Shipped || 0,
      color: "bg-zinc-500",
    },
    {
      stage: "Cleared Customs",
      count: dashboardData?.pipelineStages?.["Cleared Customs"] || 0,
      color: "bg-zinc-300",
    },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-[1600px] mx-auto min-h-screen">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-black/5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Briefcase className="text-zinc-400" size={28} /> Operations Control
            Home
          </h1>
          <p className="text-zinc-500 mt-1">
            Cross-team performance statistics, conversion ratios, and pipeline
            health.
          </p>
        </div>
        <div className="flex bg-zinc-100 p-1 rounded-xl border border-black/5">
          {["week", "month", "quarter"].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${timeframe === t ? "bg-white text-black shadow-sm" : "text-zinc-400 hover:text-zinc-900"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-black/5 rounded-[2rem] p-6 shadow-sm">
          <p className="text-xs font-bold uppercase text-zinc-400 mb-1">
            Gross Managed Pipeline
          </p>
          <h3 className="text-3xl font-bold font-mono">
            ${(dashboardData?.grossPipeline || 0).toLocaleString()}
          </h3>
        </div>
        <div className="bg-white border border-black/5 rounded-[2rem] p-6 shadow-sm">
          <p className="text-xs font-bold uppercase text-zinc-400 mb-1">
            Total Inquiries
          </p>
          <h3 className="text-3xl font-bold font-mono">
            {dashboardData?.totalRequests || 0}
          </h3>
        </div>
        {/* Add more live stats as needed */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Section */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white border border-black/5 rounded-[3rem] p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Pipeline Velocity</h3>
            <div className="space-y-4">
              {pipelineVelocity.map((bar, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>{bar.stage}</span>
                    <span>{bar.count} leads</span>
                  </div>
                  <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${bar.color}`}
                      style={{
                        width: `${Math.max(10, (bar.count / (dashboardData?.totalRequests || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section: Activity Stream */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white border border-black/5 rounded-[3rem] p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Live Pipeline Activity</h3>
            <div className="space-y-6 relative before:absolute before:top-2 before:bottom-2 before:left-3 before:w-px before:bg-black/5">
              {dashboardData?.activityStream?.map((log: any) => (
                <div key={log.id} className="relative pl-8 text-sm">
                  <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-white" />
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-zinc-900">
                      {log.operator}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {new Date(log.time).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600">{log.action}</p>
                  <div className="text-xs font-semibold mt-1 flex items-center gap-1">
                    <ArrowUpRight size={12} /> {log.target}
                  </div>
                  {log.comment && (
                    <div className="mt-2 p-3 bg-zinc-50 rounded-xl text-xs text-zinc-500 italic">
                      "{log.comment}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
