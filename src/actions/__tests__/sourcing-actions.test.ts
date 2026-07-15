import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { db as dbClient, sourcingAnalyses } from "@/db";
import {
  analyzeMarket,
  extractAuctionSheet,
  getGbpFxRates,
  getRecentSourcingAnalyses,
  getVerdict,
  saveSourcingAnalysis,
} from "../sourcing-actions";

// The @/db module is fully mocked below; alias the imported client to a
// permissive mock shape so the insert/returning/query mocks type-check.
type MockedDb = Record<string, Mock> & {
  query: Record<string, Record<string, Mock>>;
};
const db = dbClient as unknown as MockedDb;

// Mock database
vi.mock("@/db", () => {
  const mockDb = {
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn(),
    query: {
      sourcingAnalyses: {
        findMany: vi.fn(),
      },
    },
  };
  return {
    db: mockDb,
    sourcingAnalyses: { id: "sourcing_id_col" },
  };
});

// Mock Next.js headers and auth
vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue({
    get: () => "localhost",
  }),
}));

vi.mock("@/utils/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({
        user: { id: "user-1", name: "Admin User", role: "admin" },
      }),
    },
  },
}));

describe("sourcing-actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  describe("getGbpFxRates", () => {
    it("should fetch FX rates and return GBP per JPY", async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          result: "success",
          rates: { JPY: 191.5 },
        }),
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      const result = await getGbpFxRates();
      expect(result.rates.JPY).toBeDefined();
      expect(result.rates.JPY).toBe(1 / 191.5);
    });

    it("should fallback to static rates on API failure", async () => {
      vi.mocked(fetch).mockRejectedValue(new Error("Network Error"));

      const result = await getGbpFxRates();
      expect(result.rates.JPY).toBeCloseTo(1 / 190.0, 4);
    });
  });

  describe("extractAuctionSheet", () => {
    it("should return failure if key is missing", async () => {
      process.env.GEMINI_API_KEY = "";
      const result = await extractAuctionSheet({
        dataBase64: "test",
        mimeType: "image/jpeg",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toContain("GEMINI_API_KEY is not configured");
      }
    });

    it("should call Gemini API and return extracted specs on success", async () => {
      process.env.GEMINI_API_KEY = "test-key";
      const mockResult = {
        lotNo: "123",
        make: "Toyota",
        model: "Supra",
        year: "1998",
        grade: "4.5",
      };
      const mockResponse = {
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: JSON.stringify(mockResult) }],
              },
            },
          ],
          usageMetadata: { totalTokenCount: 150 },
        }),
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      const result = await extractAuctionSheet({
        dataBase64: "test",
        mimeType: "image/jpeg",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.make).toBe("Toyota");
        expect(result.data.model).toBe("Supra");
      }
    });
  });

  describe("saveSourcingAnalysis", () => {
    it("should fail if unauthorized", async () => {
      const { auth } = await import("@/utils/auth");
      vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

      const result = await saveSourcingAnalysis({} as any);
      expect(result.success).toBe(false);
    });

    it("should save analysis to database on success", async () => {
      const mockSave = { id: "analysis-1" };
      vi.mocked(db.insert(sourcingAnalyses).returning).mockResolvedValue([
        mockSave,
      ] as any);

      const result = await saveSourcingAnalysis({
        make: "Nissan",
        model: "GT-R",
        edition: "Nismo",
        year: 2020,
        mileage: 10000,
        landedCostGbp: 120000,
        currency: "JPY",
        dutyBasis: "Standard",
        vatBasis: "Standard",
        market: {
          sources: [],
          stats: {
            count: 5,
            min: 130000,
            max: 150000,
            mean: 142000,
            median: 140000,
            p25: 135000,
            p75: 145000,
            stdDev: 8000,
            histogram: [],
            trimmedOutliers: 0,
          },
          listings: [],
          allListings: [],
          matchUsed: "±1yr · ±20% mileage",
          widened: false,
          totalMatched: 5,
          totalScraped: 20,
          totalAfterClean: 12,
        },
        verdict: {
          recommendation: "source",
          headline: "Strong margins",
          reasoning: "Excellent condition",
          confidence: "high",
          grossMargin: 20000,
          marginPct: 15,
        },
      });

      expect(result.success).toBe(true);
      expect(db.insert).toHaveBeenCalled();
    });
  });

  describe("getRecentSourcingAnalyses", () => {
    it("should return list of analyses", async () => {
      const mockList = [
        {
          id: "analysis-1",
          make: "Nissan",
          vehicleModel: "GT-R",
          edition: "Nismo",
          year: 2020,
          mileage: "10000",
          landedCostGbp: 120000,
          marketMedian: 140000,
          listingCount: 5,
          sources: [],
          widened: false,
          recommendation: "Buy",
          headline: "Strong margins",
          grossMargin: 20000,
          marginPct: 15,
          createdByName: "Admin User",
          createdAt: new Date(),
        },
      ];
      vi.mocked(db.query.sourcingAnalyses.findMany).mockResolvedValue(
        mockList as any,
      );

      const result = await getRecentSourcingAnalyses();
      expect(result.length).toBe(1);
      expect(result[0].make).toBe("Nissan");
    });
  });
});
