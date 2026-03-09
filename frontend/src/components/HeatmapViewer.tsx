"use client"

interface HeatmapViewerProps {
  heatmapUrl: string;
}

export default function HeatmapViewer({heatmapUrl}: HeatmapViewerProps){
  return (
    <div className="stunning-card p-6 rounded-2xl group hover:scale-105 transition-all duration-300">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
          <span className="text-xl">🔥</span>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">AI Heatmap Analysis</h3>
          <p className="text-gray-600 text-sm">Change intensity visualization</p>
        </div>
      </div>
      
      <div className="relative rounded-xl overflow-hidden shadow-lg">
        <img 
          src={heatmapUrl} 
          alt="Anomaly Heatmap" 
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
          AI GENERATED
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="bg-blue-100 rounded-lg p-2">
          <div className="text-xs text-blue-600 font-medium">Low</div>
        </div>
        <div className="bg-yellow-100 rounded-lg p-2">
          <div className="text-xs text-yellow-600 font-medium">Medium</div>
        </div>
        <div className="bg-red-100 rounded-lg p-2">
          <div className="text-xs text-red-600 font-medium">High</div>
        </div>
      </div>
    </div>
  )
}
