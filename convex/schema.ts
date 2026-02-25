import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // Saved calculation plans
  savedPlans: defineTable({
    userId: v.id("users"),
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
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Email leads for PDF downloads
  emailLeads: defineTable({
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
    createdAt: v.number(),
    ipHash: v.optional(v.string()),
  }).index("by_email", ["email"])
    .index("by_created", ["createdAt"]),

  // Rate limiting for lead submissions
  rateLimits: defineTable({
    identifier: v.string(),
    submissions: v.array(v.number()),
  }).index("by_identifier", ["identifier"]),
});
