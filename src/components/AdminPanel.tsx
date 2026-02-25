import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface AdminPanelProps {
  onBack: () => void;
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const [passcode, setPasscode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [inputPasscode, setInputPasscode] = useState("");

  const leads = useQuery(
    api.leads.listLeads,
    authenticated ? { passcode } : "skip"
  );

  const csvData = useQuery(
    api.leads.exportLeadsCSV,
    authenticated ? { passcode } : "skip"
  );

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscode(inputPasscode);
    setAuthenticated(true);
  };

  const handleExport = () => {
    if (!csvData) return;
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!authenticated) {
    return (
      <div className="space-y-6 animate-fade-in">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="max-w-sm mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Access</h2>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Passcode
              </label>
              <input
                type="password"
                value={inputPasscode}
                onChange={(e) => setInputPasscode(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all"
                placeholder="Enter admin passcode"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/20 transition-all"
            >
              Access Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button
          onClick={handleExport}
          disabled={!csvData}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Email Leads</h2>
        <p className="text-slate-400">{leads?.length || 0} total leads</p>
      </div>

      {leads === undefined ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : leads.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400">No leads yet</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {leads.map((lead: { _id: string; email: string; createdAt: number; country: string; lifestyle: string; totalCost: number }) => (
            <div
              key={lead._id}
              className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-white font-medium">{lead.email}</span>
                <span className="text-xs text-slate-500">
                  {new Date(lead.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 bg-teal-500/20 text-teal-300 rounded-md">
                  {lead.country}
                </span>
                <span className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded-md">
                  {lead.lifestyle}
                </span>
                <span className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded-md">
                  ${lead.totalCost}/mo
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
