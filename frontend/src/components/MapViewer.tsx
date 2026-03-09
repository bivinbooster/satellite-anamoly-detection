"use client"

interface MapViewerProps {
  overlay: string;
}

export default function MapViewer({overlay}: MapViewerProps){
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-2">Satellite Map</h3>
      <div className="relative w-full h-64 bg-gray-100 rounded-lg border overflow-hidden">
        <img 
          src="https://picsum.photos/seed/satellite-map/800/400.jpg" 
          alt="Satellite Map Base" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/70 text-white p-4 rounded-lg text-center">
            <p className="text-sm">Satellite Map View</p>
            <p className="text-xs mt-1">Change overlay integration</p>
          </div>
        </div>
      </div>
    </div>
  )
}
