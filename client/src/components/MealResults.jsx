function riskColor(level) {
  if (!level) return 'bg-slate-200 text-slate-700';
  const l = level.toLowerCase();
  if (l === 'low') return 'bg-emerald-100 text-emerald-800';
  if (l === 'moderate') return 'bg-amber-100 text-amber-800';
  if (l === 'high') return 'bg-red-100 text-red-800';
  return 'bg-slate-200 text-slate-700';
}

export default function MealResults({ analysis }) {
  if (analysis.error) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <p className="text-red-600">{analysis.error}</p>
      </div>
    );
  }

  const { stage1, stage2 } = analysis;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
      <h2 className="text-lg font-semibold text-slate-800">Analysis results</h2>

      <div>
        <h3 className="font-medium text-slate-700 mb-2">Foods detected</h3>
        <ul className="space-y-2">
          {(stage1?.foods_detected || []).map((f, i) => (
            <li key={i} className="flex justify-between text-sm">
              <span>{f.name}</span>
              <span className="text-slate-500">{f.estimated_portion} • {f.estimated_carbs_g}g carbs</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 font-medium">Total carbs: {stage1?.total_estimated_carbs_g ?? 0}g</p>
      </div>

      {stage2 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-600">Predicted spike:</span>
            <span className="font-medium">{stage2.predicted_glucose_spike_mmol_L} mmol/L</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-600">Risk:</span>
            <span className={`px-2 py-1 rounded text-sm font-medium ${riskColor(stage2.risk_level)}`}>
              {stage2.risk_level}
            </span>
          </div>
          {stage2.recommendation && (
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-1">Recommendation</h4>
              <p className="text-slate-600">{stage2.recommendation}</p>
            </div>
          )}
          {(stage2.healthier_alternatives?.length > 0) && (
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-1">Healthier alternatives</h4>
              <ul className="list-disc list-inside text-slate-600 text-sm">
                {stage2.healthier_alternatives.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}
          {stage2.explanation && (
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-1">Explanation</h4>
              <p className="text-slate-600 text-sm">{stage2.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
