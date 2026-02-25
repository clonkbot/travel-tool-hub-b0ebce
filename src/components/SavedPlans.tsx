import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import type { Breakdown, Lifestyle, HousingType, TravelerType, WorkStyle } from "../data/costs";

interface SavedPlansProps {
  onSelectPlan: (plan: {
    total: number;
    breakdown: Breakdown;
    confidence: "Low" | "Medium" | "High";
    country: string;
    countryName: string;
    city?: string;
    lifestyle: Lifestyle;
    stayLength: number;
    housingType: HousingType;
    travelerType: TravelerType;
    workStyle: WorkStyle;
  }) => void;
  onBack: () => void;
}

const countryNames: Record<string, string> = {
  thailand: "Thailand",
  vietnam: "Vietnam",
  portugal: "Portugal",
  spain: "Spain",
  mexico: "Mexico",
  canada: "Canada",
  japan: "Japan",
  uae: "UAE",
  estonia: "Estonia",
};

export function SavedPlans({ onSelectPlan, onBack }: SavedPlansProps) {
  const plans = useQuery(api.plans.listSavedPlans);
  const deletePlan = useMutation(api.plans.deletePlan);

  const handleDelete = async (id: Id<"savedPlans">, e: React.MouseEvent) => {
    e.stopPropagation();
    await deletePlan({ id });
  };

  if (plans === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to calculator
      </button>

      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Saved Plans</h2>
        <p className="text-slate-400">Your saved relocation cost estimates</p>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <p className="text-slate-400">No saved plans yet</p>
          <p className="text-slate-500 text-sm mt-1">Calculate a cost estimate and save it to see it here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {plans.map((plan: { _id: Id<"savedPlans">; country: string; city?: string; lifestyle: string; housingType: string; travelerType: string; workStyle: string; totalCost: number; stayLength: number; breakdown: Breakdown; confidence: string; createdAt: number }) => (
            <div
              key={plan._id}
              onClick={() =>
                onSelectPlan({
                  total: plan.totalCost,
                  breakdown: plan.breakdown,
                  confidence: plan.confidence as "Low" | "Medium" | "High",
                  country: plan.country,
                  countryName: countryNames[plan.country] || plan.country,
                  city: plan.city,
                  lifestyle: plan.lifestyle as Lifestyle,
                  stayLength: plan.stayLength,
                  housingType: plan.housingType as HousingType,
                  travelerType: plan.travelerType as TravelerType,
                  workStyle: plan.workStyle as WorkStyle,
                })
              }
              className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 cursor-pointer hover:border-teal-500/30 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-teal-300 transition-colors">
                      {countryNames[plan.country] || plan.country}
                      {plan.city && ` – ${plan.city}`}
                    </h3>
                  </div>
                  <p className="text-slate-400 text-sm">
                    {plan.lifestyle.charAt(0).toUpperCase() + plan.lifestyle.slice(1)} •{" "}
                    {plan.housingType.toUpperCase()} •{" "}
                    {plan.travelerType.charAt(0).toUpperCase() + plan.travelerType.slice(1)}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xl font-bold text-teal-400">
                      ${plan.totalCost.toLocaleString()}/mo
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(plan.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(plan._id, e)}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
