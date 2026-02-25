import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
const MAX_SUBMISSIONS = 3;

export const submitLead = mutation({
  args: {
    email: v.string(),
    consent: v.boolean(),
    country: v.string(),
    city: v.optional(v.string()),
    lifestyle: v.string(),
    stayLength: v.number(),
    housingType: v.string(),
    travelerType: v.string(),
    workStyle: v.string(),
    totalCost: v.number(),
    breakdown: v.object({
      rent: v.number(),
      food: v.number(),
      transport: v.number(),
      utilities: v.number(),
      internet: v.number(),
      health: v.number(),
      fun: v.number(),
    }),
    identifier: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Rate limiting check
    const existing = await ctx.db
      .query("rateLimits")
      .withIndex("by_identifier", (q) => q.eq("identifier", args.identifier))
      .first();

    if (existing) {
      const recentSubmissions = existing.submissions.filter(
        (t) => now - t < RATE_LIMIT_WINDOW
      );

      if (recentSubmissions.length >= MAX_SUBMISSIONS) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }

      await ctx.db.patch(existing._id, {
        submissions: [...recentSubmissions, now],
      });
    } else {
      await ctx.db.insert("rateLimits", {
        identifier: args.identifier,
        submissions: [now],
      });
    }

    // Insert lead
    const { identifier, ...leadData } = args;
    await ctx.db.insert("emailLeads", {
      ...leadData,
      createdAt: now,
      ipHash: identifier,
    });

    return { success: true };
  },
});

export const listLeads = query({
  args: { passcode: v.string() },
  handler: async (ctx, args) => {
    // Simple passcode protection
    if (args.passcode !== "travelhub2024admin") {
      return [];
    }

    return await ctx.db
      .query("emailLeads")
      .withIndex("by_created")
      .order("desc")
      .collect();
  },
});

export const exportLeadsCSV = query({
  args: { passcode: v.string() },
  handler: async (ctx, args) => {
    if (args.passcode !== "travelhub2024admin") {
      return "";
    }

    const leads = await ctx.db
      .query("emailLeads")
      .withIndex("by_created")
      .order("desc")
      .collect();

    const headers = [
      "email", "consent", "country", "city", "lifestyle",
      "stayLength", "housingType", "travelerType", "workStyle",
      "totalCost", "breakdown", "createdAt"
    ];

    const rows = leads.map(lead => [
      lead.email,
      lead.consent,
      lead.country,
      lead.city || "",
      lead.lifestyle,
      lead.stayLength,
      lead.housingType,
      lead.travelerType,
      lead.workStyle,
      lead.totalCost,
      JSON.stringify(lead.breakdown),
      new Date(lead.createdAt).toISOString()
    ].join(","));

    return [headers.join(","), ...rows].join("\n");
  },
});
