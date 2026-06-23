import { getRecentSourcingAnalyses } from "@/actions/sourcing-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fmtGBP } from "@/lib/uk-landed-cost";

const REC_STYLE: Record<string, { label: string; cls: string }> = {
  source: { label: "Source", cls: "bg-emerald-100 text-emerald-800" },
  marginal: { label: "Marginal", cls: "bg-amber-100 text-amber-800" },
  avoid: { label: "Avoid", cls: "bg-red-100 text-red-800" },
};

// Server component — lists the most recent saved runs. Re-renders on
// router.refresh() after a save.
export default async function RecentAnalyses() {
  const runs = await getRecentSourcingAnalyses(10);
  if (runs.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent analyses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-zinc-400 border-b border-zinc-100">
                <th className="py-2 pr-3 font-medium">Date</th>
                <th className="py-2 pr-3 font-medium">Vehicle</th>
                <th className="py-2 pr-3 font-medium text-right">Landed</th>
                <th className="py-2 pr-3 font-medium text-right">Median</th>
                <th className="py-2 pr-3 font-medium text-right">Margin</th>
                <th className="py-2 pr-3 font-medium">Verdict</th>
                <th className="py-2 pr-3 font-medium">By</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((r) => {
                const style = REC_STYLE[r.recommendation] ?? REC_STYLE.marginal;
                return (
                  <tr
                    key={r.id}
                    className="border-b border-zinc-50 last:border-0"
                  >
                    <td className="py-2 pr-3 text-zinc-500 whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="py-2 pr-3 text-zinc-800">
                      {[r.year, r.make, r.vehicleModel, r.edition]
                        .filter(Boolean)
                        .join(" ")}
                    </td>
                    <td className="py-2 pr-3 text-right tabular-nums">
                      {fmtGBP(r.landedCostGbp)}
                    </td>
                    <td className="py-2 pr-3 text-right tabular-nums">
                      {r.marketMedian ? fmtGBP(r.marketMedian) : "—"}
                    </td>
                    <td
                      className={`py-2 pr-3 text-right tabular-nums font-medium ${
                        (r.grossMargin ?? 0) >= 0
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {r.grossMargin != null ? fmtGBP(r.grossMargin) : "—"}
                    </td>
                    <td className="py-2 pr-3">
                      <Badge className={`text-[10px] ${style.cls}`}>
                        {style.label}
                        {r.widened ? " ·" : ""}
                      </Badge>
                    </td>
                    <td className="py-2 pr-3 text-zinc-400 whitespace-nowrap">
                      {r.createdByName ?? "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
