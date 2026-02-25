import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listSavedPlans = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("savedPlans")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const savePlan = mutation({
  args: {
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
    confidence: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("savedPlans", {
      ...args,
      userId,
      createdAt: Date.now(),
    });
  },
});

export const deletePlan = mutation({
  args: { id: v.id("savedPlans") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const plan = await ctx.db.get(args.id);
    if (!plan || plan.userId !== userId) throw new Error("Not found");

    await ctx.db.delete(args.id);
  },
});
