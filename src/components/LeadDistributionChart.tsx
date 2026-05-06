"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart";

interface ChartData {
    stage: string;
    count: number;
    fill: string; // Required for shadcn to natively color individual bars
}

// Define the Shadcn Chart Config
const chartConfig = {
    count: {
        label: "Total Leads",
    },
    "Action required": { label: "Action Required", color: "#ef4444" },
    "Didn't get a response": { label: "No Response", color: "#e4e4e7" },
    "Stopped Responding": { label: "Stopped", color: "#e4e4e7" },
    "Responded": { label: "Responded", color: "#3b82f6" },
    "Active Conversation": { label: "Active", color: "#3b82f6" },
    "SQL": { label: "SQL", color: "#10b981" },
    "Not Qualified": { label: "Unqualified", color: "#a1a1aa" },
    "Lost": { label: "Lost", color: "#a1a1aa" },
} satisfies ChartConfig;

export default function LeadDistributionChart({ data }: { data: ChartData[] }) {
    return (
        <Card className="border-zinc-200/60 shadow-sm rounded-[2.5rem]">
            <CardHeader className="px-8 py-6 pb-2">
                <CardTitle>Conversation Stage Distribution</CardTitle>
                <CardDescription>A breakdown of where all leads currently sit in the pipeline.</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8 pt-4">
                {/* Shadcn ChartContainer handles the ResponsiveContainer logic automatically */}
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <BarChart accessibilityLayer data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.5} />
                        <XAxis
                            dataKey="stage"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                        />
                        <YAxis
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                        />
                        {/* Shadcn's customized tooltip */}
                        <ChartTooltip
                            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                            content={<ChartTooltipContent hideIndicator />}
                        />
                        {/*
                          Because we pass the 'fill' variable directly in the data object,
                          we don't need a <Cell> map here. Recharts maps it natively.
                        */}
                        <Bar dataKey="count" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}