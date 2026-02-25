import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Breakdown, Lifestyle, HousingType, TravelerType, WorkStyle } from "../data/costs";
import { LeadModal } from "./LeadModal";

interface ResultsProps {
  result: {
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
  };
  onBack: () => void;
  onCompare: () => void;
}

const breakdownLabels: Record<keyof Breakdown, { label: string; icon: string }> = {
  rent: { label: "Rent", icon: "🏠" },
  food: { label: "Food", icon: "🍽️" },
  transport: { label: "Transport", icon: "🚗" },
  utilities: { label: "Utilities", icon: "💡" },
  internet: { label: "Internet/SIM", icon: "📱" },
  health: { label: "Health/Insurance", icon: "🏥" },
  fun: { label: "Fun/Misc", icon: "🎉" },
};

const confidenceColors = {
  Low: "text-amber-400 bg-amber-500/20",
  Medium: "text-blue-400 bg-blue-500/20",
  High: "text-emerald-400 bg-emerald-500/20",
};

export function Results({ result, onBack, onCompare }: ResultsProps) {
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const savePlan = useMutation(api.plans.savePlan);

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePlan({
        country: result.country,
        city: result.city,
        lifestyle: result.lifestyle,
        stayLength: result.stayLength,
        housingType: result.housingType,
        travelerType: result.travelerType,
        workStyle: result.workStyle,
        totalCost: result.total,
        breakdown: result.breakdown,
        confidence: result.confidence,
      });
      setSaved(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

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

      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl md:text-2xl font-bold text-white">
          {result.countryName} {result.city && `– ${result.city}`}
        </h2>
        <p className="text-slate-400 text-sm">
          {result.lifestyle.charAt(0).toUpperCase() + result.lifestyle.slice(1)} •{" "}
          {result.housingType.toUpperCase()} •{" "}
          {result.travelerType.charAt(0).toUpperCase() + result.travelerType.slice(1)} •{" "}
          {result.stayLength} month{result.stayLength > 1 ? "s" : ""}
        </p>
      </div>

      {/* Total Cost Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-600/20 to-cyan-600/10 backdrop-blur-xl border border-teal-500/30 rounded-2xl p-6 md:p-8">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-slate-300 text-sm font-medium mb-1">Estimated Monthly Cost</p>
          <p className="text-4xl md:text-5xl font-bold text-white">
            ${result.total.toLocaleString()}
            <span className="text-lg md:text-xl text-slate-400 font-normal">/mo</span>
          </p>
          <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-medium ${confidenceColors[result.confidence]}`}>
            <span className="w-2 h-2 rounded-full bg-current" />
            {result.confidence} Confidence
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Cost Breakdown</h3>
        <div className="grid gap-3">
          {Object.entries(result.breakdown).map(([key, value]) => {
            const { label, icon } = breakdownLabels[key as keyof Breakdown];
            const percentage = Math.round((value / result.total) * 100);
            return (
              <div
                key={key}
                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 hover:border-slate-600/50 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{icon}</span>
                    <span className="text-white font-medium">{label}</span>
                  </div>
                  <span className="text-white font-semibold">${value.toLocaleString()}</span>
                </div>
                <div className="relative h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-right text-xs text-slate-500 mt-1">{percentage}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Primary CTA */}
      <button
        onClick={() => setShowModal(true)}
        className="w-full py-4 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-bold text-lg rounded-xl shadow-lg shadow-teal-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Download Full Relocation Plan (PDF)
      </button>

      {/* Secondary CTAs */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onCompare}
          className="py-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 text-slate-300 font-medium rounded-xl transition-all hover:text-white text-sm"
        >
          Compare Another
        </button>
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className="py-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 text-slate-300 font-medium rounded-xl transition-all hover:text-white text-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saved ? (
            <>
              <svg className="w-4 h-4 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Saved
            </>
          ) : saving ? (
            "Saving..."
          ) : (
            "Save This Plan"
          )}
        </button>
      </div>

      {/* Affiliate Tools */}
      <div className="space-y-3 pt-4 border-t border-slate-700/50">
        <h3 className="text-sm font-medium text-slate-400">Recommended travel tools for this move</h3>
        <div className="grid gap-2">
          <a
            href={`https://traveltoolhub.com/compare/esim-providers?country=${result.country}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-3 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/30 rounded-xl transition-all group"
          >
            <span className="flex items-center gap-3 text-slate-300 group-hover:text-white transition-colors">
              <span className="text-lg">📱</span>
              Best eSIMs for {result.countryName}
            </span>
            <svg className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <a
            href="https://traveltoolhub.com/compare/vpn-providers"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-3 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/30 rounded-xl transition-all group"
          >
            <span className="flex items-center gap-3 text-slate-300 group-hover:text-white transition-colors">
              <span className="text-lg">🔐</span>
              Best VPNs for booking savings
            </span>
            <svg className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <a
            href="https://traveltoolhub.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-3 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/30 rounded-xl transition-all group"
          >
            <span className="flex items-center gap-3 text-slate-300 group-hover:text-white transition-colors">
              <span className="text-lg">✈️</span>
              Flights: compare prices
            </span>
            <svg className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      {/* Lead Modal */}
      {showModal && (
        <LeadModal
          result={result}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
