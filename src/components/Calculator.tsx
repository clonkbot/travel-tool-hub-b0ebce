import { useState, useMemo } from "react";
import {
  countries,
  calculateCosts,
  type Lifestyle,
  type HousingType,
  type TravelerType,
  type WorkStyle,
  type CalculationResult,
} from "../data/costs";

interface CalculatorProps {
  onCalculate: (result: CalculationResult & {
    country: string;
    countryName: string;
    city?: string;
    lifestyle: Lifestyle;
    stayLength: number;
    housingType: HousingType;
    travelerType: TravelerType;
    workStyle: WorkStyle;
  }) => void;
}

export function Calculator({ onCalculate }: CalculatorProps) {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [lifestyle, setLifestyle] = useState<Lifestyle>("comfortable");
  const [stayLength, setStayLength] = useState(6);
  const [housingType, setHousingType] = useState<HousingType>("studio");
  const [travelerType, setTravelerType] = useState<TravelerType>("solo");
  const [workStyle, setWorkStyle] = useState<WorkStyle>("remote");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredCountries = useMemo(() => {
    if (!searchTerm) return countries;
    return countries.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const selectedCountry = countries.find((c) => c.key === country);

  const handleCalculate = () => {
    if (!country) return;

    const result = calculateCosts({
      country,
      city: city || undefined,
      lifestyle,
      stayLength,
      housingType,
      travelerType,
      workStyle,
    });

    onCalculate({
      ...result,
      country,
      countryName: selectedCountry?.name || country,
      city: city || undefined,
      lifestyle,
      stayLength,
      housingType,
      travelerType,
      workStyle,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Country Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">
          Country <span className="text-teal-400">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={showDropdown ? searchTerm : selectedCountry?.name || ""}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search country..."
            className="w-full px-4 py-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all"
          />
          {showDropdown && (
            <div className="absolute z-50 w-full mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
              {filteredCountries.map((c) => (
                <button
                  key={c.key}
                  onClick={() => {
                    setCountry(c.key);
                    setSearchTerm("");
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left text-white hover:bg-teal-500/20 transition-colors first:rounded-t-xl last:rounded-b-xl flex items-center gap-3"
                >
                  <span className="text-2xl">{getFlagEmoji(c.code)}</span>
                  <span>{c.name}</span>
                </button>
              ))}
              {filteredCountries.length === 0 && (
                <div className="px-4 py-3 text-slate-400">No countries found</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* City */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">
          City <span className="text-slate-500">(optional)</span>
        </label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g., Bangkok, Lisbon..."
          className="w-full px-4 py-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all"
        />
      </div>

      {/* Lifestyle */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">Lifestyle</label>
        <div className="grid grid-cols-3 gap-2">
          {(["budget", "comfortable", "premium"] as Lifestyle[]).map((l) => (
            <button
              key={l}
              onClick={() => setLifestyle(l)}
              className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${
                lifestyle === l
                  ? "bg-teal-500/20 border-2 border-teal-500 text-teal-300"
                  : "bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:border-slate-600"
              }`}
            >
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stay Length */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-300">
          Stay Length: <span className="text-teal-400">{stayLength} month{stayLength > 1 ? "s" : ""}</span>
        </label>
        <input
          type="range"
          min="1"
          max="12"
          value={stayLength}
          onChange={(e) => setStayLength(Number(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer slider-teal"
        />
        <div className="flex justify-between text-xs text-slate-500">
          <span>1 month</span>
          <span>12 months</span>
        </div>
      </div>

      {/* Housing Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">Housing Type</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {([
            { value: "room", label: "Room" },
            { value: "studio", label: "Studio" },
            { value: "1br", label: "1BR" },
            { value: "2br", label: "2BR" },
          ] as { value: HousingType; label: string }[]).map((h) => (
            <button
              key={h.value}
              onClick={() => setHousingType(h.value)}
              className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${
                housingType === h.value
                  ? "bg-teal-500/20 border-2 border-teal-500 text-teal-300"
                  : "bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:border-slate-600"
              }`}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>

      {/* Traveler Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">Traveler Type</label>
        <div className="grid grid-cols-2 gap-2">
          {(["solo", "couple"] as TravelerType[]).map((t) => (
            <button
              key={t}
              onClick={() => setTravelerType(t)}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                travelerType === t
                  ? "bg-teal-500/20 border-2 border-teal-500 text-teal-300"
                  : "bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:border-slate-600"
              }`}
            >
              <span>{t === "solo" ? "👤" : "👥"}</span>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Work Style */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">Work Style</label>
        <div className="grid grid-cols-3 gap-2">
          {([
            { value: "remote", label: "Remote", icon: "💻" },
            { value: "local", label: "Local Job", icon: "🏢" },
            { value: "student", label: "Student", icon: "📚" },
          ] as { value: WorkStyle; label: string; icon: string }[]).map((w) => (
            <button
              key={w.value}
              onClick={() => setWorkStyle(w.value)}
              className={`py-3 px-2 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                workStyle === w.value
                  ? "bg-teal-500/20 border-2 border-teal-500 text-teal-300"
                  : "bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:border-slate-600"
              }`}
            >
              <span className="text-lg">{w.icon}</span>
              <span className="text-xs">{w.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Calculate Button */}
      <button
        onClick={handleCalculate}
        disabled={!country}
        className="w-full py-4 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-bold text-lg rounded-xl shadow-lg shadow-teal-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        Calculate Costs
      </button>
    </div>
  );
}

function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
