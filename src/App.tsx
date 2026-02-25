import { useState, useEffect } from "react";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { AirplaneIcon } from "./components/AirplaneIcon";
import { AuthScreen } from "./components/AuthScreen";
import { Calculator } from "./components/Calculator";
import { Results } from "./components/Results";
import { SavedPlans } from "./components/SavedPlans";
import { AdminPanel } from "./components/AdminPanel";
import type { Breakdown, Lifestyle, HousingType, TravelerType, WorkStyle } from "./data/costs";

type Screen = "calculator" | "results" | "saved" | "admin";

interface CalculationResult {
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
}

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const [screen, setScreen] = useState<Screen>("calculator");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [adminClickCount, setAdminClickCount] = useState(0);

  // Secret admin access: tap logo 5 times
  useEffect(() => {
    if (adminClickCount >= 5) {
      setScreen("admin");
      setAdminClickCount(0);
    }
  }, [adminClickCount]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  const handleCalculate = (calcResult: CalculationResult) => {
    setResult(calcResult);
    setScreen("results");
  };

  const renderScreen = () => {
    switch (screen) {
      case "results":
        return result ? (
          <Results
            result={result}
            onBack={() => setScreen("calculator")}
            onCompare={() => setScreen("calculator")}
          />
        ) : null;
      case "saved":
        return (
          <SavedPlans
            onSelectPlan={(plan) => {
              setResult(plan);
              setScreen("results");
            }}
            onBack={() => setScreen("calculator")}
          />
        );
      case "admin":
        return <AdminPanel onBack={() => setScreen("calculator")} />;
      default:
        return <Calculator onCalculate={handleCalculate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden flex flex-col">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-32 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-32 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-900/5 rounded-full blur-3xl" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 py-4 md:py-6 border-b border-slate-800/50 backdrop-blur-xl bg-slate-900/30">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={() => setAdminClickCount((c) => c + 1)}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/10 backdrop-blur-xl border border-teal-500/20 flex items-center justify-center">
              <AirplaneIcon className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h1 className="text-lg font-bold text-white leading-tight">TravelToolHub</h1>
              <p className="text-xs text-slate-500">Move Abroad Calculator</p>
            </div>
          </button>

          <div className="flex items-center gap-2">
            {screen === "calculator" && (
              <button
                onClick={() => setScreen("saved")}
                className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all"
                title="Saved Plans"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </button>
            )}
            <button
              onClick={() => signOut()}
              className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all"
              title="Sign Out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 px-4 py-6 md:py-8">
        <div className="max-w-lg mx-auto">
          {screen === "calculator" && (
            <div className="mb-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Move Abroad Cost Calculator
              </h2>
              <p className="text-slate-400">
                Estimate your monthly living costs for your next destination
              </p>
            </div>
          )}
          {renderScreen()}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-4 py-6 border-t border-slate-800/50 backdrop-blur-xl bg-slate-900/30">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-xs text-slate-600">
            Requested by <span className="text-slate-500">@altyyy</span> · Built by <span className="text-slate-500">@clonkbot</span>
          </p>
        </div>
      </footer>

      {/* Global Styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }

        .slider-teal::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #14b8a6, #1F9E94);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(20, 184, 166, 0.5);
          transition: transform 0.2s;
        }

        .slider-teal::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }

        .slider-teal::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #14b8a6, #1F9E94);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(20, 184, 166, 0.5);
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.5);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.5);
        }

        /* Remove dropdown arrows in iOS */
        input[type="text"],
        input[type="email"],
        input[type="password"] {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }
      `}</style>
    </div>
  );
}
