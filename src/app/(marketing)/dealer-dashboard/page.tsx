import {
  Activity,
  Car,
  Code,
  DollarSign,
  ExternalLink,
  Users,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getDealerDashboardData } from "@/actions/dealer-actions";
import CopyButton from "@/components/CopyButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function DealerDashboard() {
  const res = await getDealerDashboardData();

  // If unauthorized or no profile found, redirect to partner signup
  if (!res.success || !res.profile || !res.stats || !res.leads) {
    redirect("/signup");
  }

  const { profile, stats, leads } = res;
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://providenceauto.com";
  const embedCode = `<script src="${baseUrl}/embed.js" \n  data-dealer-id="${profile.dealerId}"></script>\n<div id="providence-widget"></div>`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Dashboard Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 border border-white/20 p-2 rounded-xl">
              <Car size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">
                Providence Auto
              </h1>
              <p className="text-xs text-blue-400 font-medium tracking-widest uppercase">
                Dealer Portal
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{profile.companyName}</span>
            <div className="h-10 w-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-sm tracking-wider">
              {profile.companyName
                .split(" ")
                .map((w) => w[0])
                .join("")
                .substring(0, 2)
                .toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Welcome back.
            </h2>
            <p className="text-gray-400">
              Here is an overview of your B2B sourcing network (Dealer ID:{" "}
              {profile.dealerId}).
            </p>
          </div>
          <Link href="/request">
            <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-6 font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              + New Manual Request
            </Button>
          </Link>
        </div>

        {/* KPI Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            {
              title: "Active Leads",
              value: stats.activeLeadsCount.toString(),
              icon: Users,
              color: "text-blue-400",
            },
            {
              title: "Vehicles Sourcing",
              value: stats.vehiclesSourcingCount.toString(),
              icon: Activity,
              color: "text-orange-400",
            },
            {
              title: "Successfully Shipped",
              value: stats.successfullyShippedCount.toString(),
              icon: Car,
              color: "text-green-400",
            },
            {
              title: "Est. Commission",
              value: `$${stats.estimatedCommission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              icon: DollarSign,
              color: "text-emerald-400",
            },
          ].map((stat) => (
            <Card
              key={stat.title}
              className="bg-white/5 border-white/10 backdrop-blur-md"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* The "Smart-Embed" Widget Card */}
          <Card className="bg-gradient-to-br from-blue-900/20 to-black border-white/10 backdrop-blur-md lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Code className="text-blue-400" /> Smart-Embed Widget
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-400 text-sm">
                Copy and paste this code snippet into your website's HTML to
                display the request form to your customers.
              </p>
              <div className="relative">
                <pre className="bg-black/60 p-4 rounded-xl border border-white/10 text-xs text-blue-300 overflow-x-auto whitespace-pre">
                  <code>{embedCode}</code>
                </pre>
                <CopyButton textToCopy={embedCode} />
              </div>
              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10 mt-4 rounded-full"
              >
                View Installation Guide{" "}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Recent Leads Table */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl">Recent Widget Leads</CardTitle>
            </CardHeader>
            <CardContent>
              {leads.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-sm">
                  No widget leads generated yet. Deploy the embed snippet on
                  your website to start receiving inquiries.
                </div>
              ) : (
                <Table>
                  <TableHeader className="border-b border-white/10">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-gray-400">Client</TableHead>
                      <TableHead className="text-gray-400">
                        Requested Vehicle
                      </TableHead>
                      <TableHead className="text-gray-400">
                        Agreed Value
                      </TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow
                        key={lead.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <TableCell className="font-medium text-white">
                          {lead.name}
                          <br />
                          <span className="text-xs text-gray-500 font-normal">
                            {new Date(lead.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {lead.make} {lead.vehicleModel}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {lead.agreedPrice
                            ? `$${lead.agreedPrice.toLocaleString()}`
                            : "Pending Quote"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`
                              ${lead.status === "New" ? "border-blue-500/50 text-blue-400" : ""}
                              ${["Sourcing", "Inspected", "Acquired"].includes(lead.status) ? "border-orange-500/50 text-orange-400" : ""}
                              ${lead.status === "Shipped" ? "border-green-500/50 text-green-400" : ""}
                              bg-black/40 backdrop-blur-md
                            `}
                          >
                            {lead.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
