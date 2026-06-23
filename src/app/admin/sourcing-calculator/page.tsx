import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getGbpFxRates } from "@/actions/sourcing-actions";
import { auth } from "@/utils/auth";
import LandedCostClient from "./LandedCostClient";
import RecentAnalyses from "./RecentAnalyses";

// Sourcing & Profit tool — admin + Sales only. Phase 1: landed-cost calculator.
export default async function SourcingCalculatorPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth/sign-in");

  // Gate to staff. Roles per Better-Auth custom field: user | Sales | admin.
  const role = (session.user as { role?: string }).role ?? "user";
  if (role !== "admin" && role !== "Sales") redirect("/admin");

  const fx = await getGbpFxRates();

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-[1100px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Sourcing & Profit Analyzer
        </h1>
        <p className="text-zinc-500 mt-1">
          Estimate the UK landed cost of an import and weigh it against the live
          market. Phase 1 — landed cost.
        </p>
      </div>

      <LandedCostClient fx={fx} />

      <RecentAnalyses />
    </div>
  );
}
