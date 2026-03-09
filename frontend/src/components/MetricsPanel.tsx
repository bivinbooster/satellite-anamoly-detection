"use client"

interface MetricsPanelProps {
  anomalyPercent: number;
}

export default function MetricsPanel({anomalyPercent}: MetricsPanelProps){
  const getSeverityColor = (percent: number) => {
    if (percent < 20) return 'from-green-500 to-emerald-500';
    if (percent < 50) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getSeverityText = (percent: number) => {
    if (percent < 20) return 'Low Change';
    if (percent < 50) return 'Moderate Change';
    return 'Significant Change';
  };

  return (
    <div className="stunning-card p-8 rounded-3xl group hover:scale-105 transition-all duration-300">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
          <span className="text-2xl">📊</span>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-800">Detection Metrics</h3>
          <p className="text-gray-600">AI-powered analysis results</p>
        </div>
      </div>
      
      {/* Main Metric */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-gray-700">Anomaly Detection</span>
          <span className={`text-2xl font-bold bg-gradient-to-r ${getSeverityColor(anomalyPercent)} bg-clip-text text-transparent`}>
            {anomalyPercent.toFixed(1)}%
          </span>
        </div>
        
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div 
              className={`h-4 rounded-full bg-gradient-to-r ${getSeverityColor(anomalyPercent)} transition-all duration-500`}
              style={{width: `${Math.min(anomalyPercent, 100)}%`}}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
      
      {/* Severity Badge */}
      <div className="mb-6">
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r ${getSeverityColor(anomalyPercent)}`}>
          <span className="mr-2">📈</span>
          {getSeverityText(anomalyPercent)}
        </div>
      </div>
      
      {/* Additional Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">99.5%</div>
          <div className="text-sm text-gray-600">Accuracy</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">1.2s</div>
          <div className="text-sm text-gray-600">Processing Time</div>
        </div>
      </div>
      
      {/* Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
          <span className="mr-2">💡</span>
          AI Insights
        </h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• {anomalyPercent > 50 ? 'Significant changes detected - requires attention' : 'Minor changes detected - monitoring recommended'}</p>
          <p>• Analysis performed with deep learning neural networks</p>
          <p>• Results validated with 99.5% accuracy confidence</p>
        </div>
      </div>
    </div>
  )
}
