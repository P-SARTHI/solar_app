
import React, { useState, useMemo } from 'react';
import { Sun, Zap, Leaf, Info, Calculator as CalcIcon, ChevronRight, TrendingDown, HardHat, Landmark, MapPin } from 'lucide-react';
import { CalculationInput, CalculationResult, PanelType, AIAdvice } from './types.ts';
import { PANEL_CONFIGS, INDIAN_STATES } from './constants.ts';
import { calculateSolarMetrics } from './services/solarCalculator.ts';
import { getAIAdvice } from './services/geminiService.ts';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const App: React.FC = () => {
  const [input, setInput] = useState<CalculationInput>({
    monthlyConsumption: 300,
    sunHoursPerDay: 5.0,
    electricityRate: 8.50,
    state: "Uttar Pradesh",
    selectedPanelType: PanelType.DCR_PANELS
  });

  const [results, setResults] = useState<CalculationResult | null>(null);
  const [aiAdvice, setAiAdvice] = useState<AIAdvice | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const metrics = calculateSolarMetrics(input);
      setResults(metrics);
      
      const advice = await getAIAdvice(input, metrics);
      setAiAdvice(advice);
      
      setIsCalculated(true);
    } catch (error) {
      console.error("Calculation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = useMemo(() => {
    if (!results) return [];
    return Array.from({ length: 15 }, (_, i) => {
      const year = i + 1;
      const cumulativeSavings = results.monthlySavings * 12 * year;
      const netBenefit = cumulativeSavings - results.finalCost;
      return {
        year: `Y${year}`,
        savings: Math.round(cumulativeSavings),
        net: Math.round(netBenefit),
      };
    });
  }, [results]);

  const formatINR = (val: number | undefined) => 
    `₹${(val || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-24 selection:bg-yellow-400 selection:text-black">
      {/* Header */}
      <nav className="sticky top-0 z-50 glass-morphism border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400 p-2 rounded-xl shadow-[0_0_15px_rgba(251,191,36,0.4)]">
            <Sun className="text-black w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
            Parth <span className="text-yellow-400">Solar</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-yellow-400/10 px-4 py-2 rounded-full border border-yellow-400/20">
          <Landmark className="w-4 h-4 text-yellow-400" />
          <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">PM Surya Ghar Yojana</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-12">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter">
            SOLAR POWERED. <br />
            <span className="text-yellow-400">FINANCIALLY FREE.</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
            Smart calculations for smarter homes. Parth Solar Solutions provides precision estimates for your green energy transition.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Input Panel */}
          <div className="lg:col-span-5 space-y-6">
            <section className="bg-[#111111] p-8 rounded-[2.5rem] shadow-2xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 blur-3xl rounded-full"></div>
              
              <div className="flex items-center gap-3 mb-8 relative z-10">
                <CalcIcon className="text-yellow-400 w-5 h-5" />
                <h2 className="text-xl font-black uppercase tracking-tight">System Configurator</h2>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Select State</label>
                    <div className="relative">
                      <select 
                        value={input.state}
                        onChange={(e) => setInput({...input, state: e.target.value})}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all font-bold appearance-none text-white input-glow group-hover:border-white/20"
                      >
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <MapPin className="absolute right-4 top-4 text-slate-500 w-4 h-4 pointer-events-none" />
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Monthly Units</label>
                    <input 
                      type="number"
                      value={input.monthlyConsumption}
                      onChange={(e) => setInput({...input, monthlyConsumption: Number(e.target.value)})}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all font-bold text-white input-glow group-hover:border-white/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Peak Sun Hrs</label>
                    <input 
                      type="number"
                      step="0.1"
                      value={input.sunHoursPerDay}
                      onChange={(e) => setInput({...input, sunHoursPerDay: Number(e.target.value)})}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all font-bold text-white input-glow group-hover:border-white/20"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Unit Rate (₹)</label>
                    <input 
                      type="number"
                      step="0.5"
                      value={input.electricityRate}
                      onChange={(e) => setInput({...input, electricityRate: Number(e.target.value)})}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all font-bold text-white input-glow group-hover:border-white/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">Panel Technology</label>
                  <div className="grid gap-3">
                    {Object.values(PANEL_CONFIGS).map((p) => (
                      <button
                        key={p.type}
                        onClick={() => setInput({...input, selectedPanelType: p.type})}
                        className={`text-left p-4 rounded-2xl border-2 transition-all duration-300 ${
                          input.selectedPanelType === p.type 
                          ? 'border-yellow-400 bg-yellow-400/5 shadow-[0_0_20px_rgba(251,191,36,0.1)]' 
                          : 'border-white/5 hover:border-white/20 bg-white/5'
                        }`}
                      >
                        <div className="font-black flex justify-between items-center mb-1 text-sm uppercase tracking-tight">
                          {p.type.replace('_', ' ')}
                          {input.selectedPanelType === p.type && <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_10px_#fbbf24]" />}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{p.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleCalculate}
                  disabled={loading}
                  className="w-full py-5 bg-yellow-400 text-black rounded-2xl font-black text-lg hover:bg-yellow-300 transition-all shadow-[0_10px_30px_rgba(251,191,36,0.3)] flex justify-center items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed uppercase italic tracking-tighter"
                >
                  {loading ? 'Crunching Numbers...' : 'Generate ROI Report'}
                  {!loading && <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </section>

            {isCalculated && aiAdvice && (
              <div className="bg-yellow-400 p-8 rounded-[2.5rem] text-black shadow-2xl animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 fill-black" />
                  <h3 className="font-black uppercase italic tracking-tighter text-xl">Parth AI Analysis</h3>
                </div>
                <p className="text-black/80 text-sm leading-relaxed mb-6 font-bold italic">"{aiAdvice.summary}"</p>
                <div className="space-y-3 mb-6">
                  {aiAdvice.benefits.map((benefit, i) => (
                    <div key={i} className="flex gap-3 items-start text-sm">
                      <div className="mt-1.5 min-w-[6px] h-[6px] rounded-full bg-black" />
                      <span className="font-bold">{benefit}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-black/10 p-4 rounded-2xl border border-black/10">
                  <p className="text-[10px] font-black uppercase tracking-wider mb-2">Expert Recommendation</p>
                  <p className="text-sm font-bold">{aiAdvice.recommendations}</p>
                </div>
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7 space-y-6">
            {!isCalculated ? (
              <div className="h-full min-h-[650px] flex flex-col items-center justify-center bg-[#0d0d0d] rounded-[3rem] border border-white/5 p-12 text-center">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8">
                  <Sun className="text-yellow-400 w-12 h-12 animate-pulse" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter">Awaiting Input</h3>
                <p className="text-slate-500 max-w-xs mx-auto mt-4 text-sm leading-relaxed font-medium">Configure your energy profile to see the future of your savings with Parth Solar Solutions.</p>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                {/* Stats Cards */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#111111] p-8 rounded-[2rem] border border-white/5 group transition-all hover:border-yellow-400/30">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-yellow-400 p-2.5 rounded-xl">
                        <Zap className="text-black w-5 h-5" />
                      </div>
                      <span className="font-black text-slate-500 uppercase text-xs tracking-widest">Solar Capacity</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-6xl font-black text-white italic">{results?.requiredKW}</span>
                      <span className="text-yellow-400 font-black uppercase text-sm tracking-tighter">kW System</span>
                    </div>
                  </div>
                  <div className="bg-[#111111] p-8 rounded-[2rem] border border-white/5 transition-all hover:border-yellow-400/30">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-white/10 p-2.5 rounded-xl">
                        <TrendingDown className="text-yellow-400 w-5 h-5" />
                      </div>
                      <span className="font-black text-slate-500 uppercase text-xs tracking-widest">Payback Speed</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-6xl font-black text-white italic">{results?.paybackPeriod.toFixed(1)}</span>
                      <span className="text-yellow-400 font-black uppercase text-sm tracking-tighter">Years</span>
                    </div>
                  </div>
                </div>

                {/* Costs Detail */}
                <div className="bg-[#111111] p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-400/5 blur-3xl rounded-full"></div>
                  <h3 className="text-xl font-black mb-8 flex items-center gap-3 uppercase tracking-tighter">
                    <Landmark className="w-6 h-6 text-yellow-400" />
                    Financial Analysis
                  </h3>
                  <div className="space-y-5">
                    <div className="flex justify-between items-center py-4 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <Sun className="w-5 h-5 text-slate-500" />
                        <span className="text-slate-400 font-bold">Hardware Components</span>
                      </div>
                      <span className="font-black text-xl">{formatINR(results?.hardwareCost)}</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <HardHat className="w-5 h-5 text-slate-500" />
                        <span className="text-slate-400 font-bold">Labor & Installation</span>
                      </div>
                      <span className="font-black text-xl">{formatINR(results?.installationCost)}</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center">
                          <Info className="w-3 h-3 text-black" />
                        </div>
                        <span className="text-yellow-400 font-black">Govt Subsidy (Total)</span>
                      </div>
                      <span className="font-black text-xl text-yellow-400">-{formatINR((results?.centralSubsidy || 0) + (results?.stateSubsidy || 0))}</span>
                    </div>
                    <div className="flex justify-between items-center pt-8">
                      <span className="text-2xl font-black uppercase tracking-tighter italic">Total Investment</span>
                      <div className="text-right">
                        <span className="text-5xl font-black text-yellow-400 tracking-tighter">{formatINR(results?.finalCost)}</span>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-2">Net of all incentives</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Eco Card */}
                <div className="bg-yellow-400 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
                  <div className="bg-black/10 p-6 rounded-[2rem] border border-black/5 relative z-10">
                    <Leaf className="w-12 h-12 text-black" />
                  </div>
                  <div className="flex-1 text-center md:text-left relative z-10">
                    <h3 className="text-black font-black text-2xl uppercase italic tracking-tighter mb-1">Impact Factor</h3>
                    <p className="text-black/70 font-bold mb-6 italic">Your choice today builds a cleaner tomorrow for Bharat.</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                      <div className="bg-black text-white px-5 py-2.5 rounded-full flex items-center gap-3">
                        <span className="font-black">{results?.co2Saved.toLocaleString()}kg</span>
                        <span className="text-[10px] text-yellow-400 uppercase font-black tracking-widest">CO2 / Year</span>
                      </div>
                      <div className="bg-white text-black px-5 py-2.5 rounded-full flex items-center gap-3 font-bold">
                        <span className="font-black">{results?.treesEquivalent}</span>
                        <span className="text-[10px] opacity-60 uppercase font-black tracking-widest">Trees</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-[#111111] p-10 rounded-[2.5rem] border border-white/5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tighter">Wealth Projection</h3>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">15-Year Financial Forecast</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-800" />
                        <span className="text-[10px] font-black text-slate-500 uppercase">Savings</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_8px_#fbbf24]" />
                        <span className="text-[10px] font-black text-yellow-400 uppercase">Profit</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1e293b" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#1e293b" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.6}/>
                            <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 700}} dy={15} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 700}} tickFormatter={(v) => `₹${v/1000}k`} />
                        <Tooltip 
                          cursor={{stroke: '#fbbf24', strokeWidth: 1}}
                          contentStyle={{backgroundColor: '#111', borderRadius: '20px', border: '1px solid #ffffff10', padding: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}
                          itemStyle={{fontWeight: '900', textTransform: 'uppercase', fontSize: '10px'}}
                        />
                        <Area type="monotone" dataKey="savings" stroke="#1e293b" strokeWidth={2} fillOpacity={1} fill="url(#colorSavings)" />
                        <Area type="monotone" dataKey="net" stroke="#fbbf24" strokeWidth={5} fillOpacity={1} fill="url(#colorNet)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating CTA */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 px-4 w-full max-w-lg">
        <div className="bg-[#111111]/90 backdrop-blur-2xl rounded-3xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 pl-3">
            <div className="bg-yellow-400 p-3 rounded-2xl shadow-[0_0_20px_rgba(251,191,36,0.2)]">
              <Landmark className="w-5 h-5 text-black" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Questions?</p>
              <p className="text-sm font-black text-white uppercase italic">Talk to Parth Experts</p>
            </div>
          </div>
          <button className="bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black text-xs hover:bg-yellow-300 transition-all uppercase tracking-widest shadow-[0_5px_15px_rgba(251,191,36,0.2)]">
            Consult Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
