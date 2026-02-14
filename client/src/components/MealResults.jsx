function riskColor(level) {
  if (!level) return 'bg-gray-100 text-gray-600';
  const l = level.toLowerCase();
  if (l === 'low') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (l === 'moderate') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (l === 'high') return 'bg-red-50 text-red-700 border-red-200';
  return 'bg-gray-100 text-gray-600';
}

function riskBar(level) {
  const l = (level || '').toLowerCase();
  if (l === 'low') return { width: '33%', color: 'bg-emerald-500' };
  if (l === 'moderate') return { width: '66%', color: 'bg-amber-500' };
  if (l === 'high') return { width: '100%', color: 'bg-red-500' };
  return { width: '0%', color: 'bg-gray-300' };
}

export default function MealResults({ analysis }) {
  if (analysis.error) {
    return (
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p className="font-medium text-red-800">Analysis failed</p>
            <p className="text-red-600 text-sm mt-0.5">{analysis.error}</p>
          </div>
        </div>
      </div>
    );
  }

  const { stage1, stage2 } = analysis;
  const risk = riskBar(stage2?.risk_level);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
        <h2 className="font-semibold text-gray-900">Analysis Results</h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Foods detected */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 pt-4 pb-3 border-b border-gray-50">
            <h3 className="text-sm font-semibold text-gray-900">Foods Detected</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {(stage1?.foods_detected || []).map((f, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-purple/10 flex items-center justify-center text-brand-purple text-sm font-bold">
                    {f.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{f.name}</p>
                    <p className="text-xs text-gray-400">{f.estimated_portion}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{f.estimated_carbs_g}g carbs</p>
                  <p className="text-xs text-gray-500">{f.estimated_calories || 0} kcal</p>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-purple rounded-full" style={{ width: `${Math.min((f.confidence || 0) * 100, 100)}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-400">{Math.round((f.confidence || 0) * 100)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 bg-gray-50/50 flex justify-between items-center">
            <span className="text-sm text-gray-500">Totals</span>
            <div className="text-right">
              <span className="text-lg font-bold text-gray-900">{stage1?.total_estimated_carbs_g ?? 0}g</span>
              <span className="text-sm text-gray-400 ml-2">carbs</span>
              <span className="text-sm text-gray-300 mx-2">·</span>
              <span className="text-lg font-bold text-gray-900">{stage1?.total_estimated_calories ?? 0}</span>
              <span className="text-sm text-gray-400 ml-1">kcal</span>
            </div>
          </div>
        </div>

        {/* Risk & spike card */}
        {stage2 && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs text-gray-400 font-medium mb-1">Predicted Spike</p>
              <p className="text-3xl font-bold text-gray-900">
                +{stage2.predicted_glucose_spike_mmol_L}
                <span className="text-sm font-normal text-gray-400 ml-1">mmol/L</span>
              </p>
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                  <span>Low</span><span>Moderate</span><span>High</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${risk.color} rounded-full transition-all duration-500`} style={{ width: risk.width }} />
                </div>
              </div>
              <div className="mt-3">
                <span className={`inline-block text-xs px-3 py-1 rounded-full font-semibold border ${riskColor(stage2.risk_level)}`}>
                  {stage2.risk_level} Risk
                </span>
              </div>
            </div>

            {stage2.confidence_score && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs text-gray-400 font-medium mb-1">Confidence</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-purple rounded-full" style={{ width: `${(stage2.confidence_score || 0) * 100}%` }} />
                  </div>
                  <span className="text-sm font-bold text-gray-900">{Math.round((stage2.confidence_score || 0) * 100)}%</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recommendations */}
      {stage2 && (
        <div className="grid md:grid-cols-2 gap-4">
          {stage2.recommendation && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                </div>
                <h4 className="text-sm font-semibold text-gray-900">Recommendation</h4>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{stage2.recommendation}</p>
            </div>
          )}

          {(stage2.healthier_alternatives?.length > 0) && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h4 className="text-sm font-semibold text-gray-900">Healthier Alternatives</h4>
              </div>
              <ul className="space-y-2">
                {stage2.healthier_alternatives.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Explanation */}
      {stage2?.explanation && (
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h4 className="text-sm font-semibold text-gray-700">How this works</h4>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">{stage2.explanation}</p>
        </div>
      )}
    </div>
  );
}
