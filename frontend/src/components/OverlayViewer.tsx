"use client"

interface OverlayViewerProps {
  overlayUrl: string;
}

export default function OverlayViewer({overlayUrl}: OverlayViewerProps){
  return (
    <div className="stunning-card p-6 rounded-2xl group hover:scale-105 transition-all duration-300">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
          <span className="text-xl">🎯</span>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Change Overlay</h3>
          <p className="text-gray-600 text-sm">Highlighted differences</p>
        </div>
      </div>
      
      <div className="relative rounded-xl overflow-hidden shadow-lg">
        <img 
          src={overlayUrl} 
          alt="Change Overlay" 
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
          AI DETECTED
        </div>
        <div className="absolute bottom-4 left-4 bg-red-600/80 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
          CHANGES HIGHLIGHTED
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <span className="font-semibold">Overlay Type:</span> AI Detection
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-semibold">Confidence:</span> 98.7%
        </div>
      </div>
    </div>
  )
}
