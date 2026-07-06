import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { divIcon } from 'leaflet';
import api from '../api/axios';
import { useNavigate } from 'react-router';
import { Navigation } from 'lucide-react';

const userLocationIcon = divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.8);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

function LocateControl({ setUserLocation }: { setUserLocation: (loc: [number, number]) => void }) {
  const map = useMap();
  const [locating, setLocating] = useState(false);

  const handleLocate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocating(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(loc);
          map.flyTo(loc, 15, { animate: true, duration: 1.5 });
          setLocating(false);
        },
        () => {
          alert("Please allow location permissions to use this feature.");
          setLocating(false);
        }
      );
    }
  };

  return (
    <div className="absolute bottom-6 right-6 z-[400]">
      <button 
        onClick={handleLocate}
        disabled={locating}
        className="glass bg-white/90 dark:bg-slate-800/90 text-primary-600 px-4 py-3 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 hover:bg-white transition-all flex items-center gap-2 font-bold text-sm card-hover"
      >
        <Navigation className={`w-5 h-5 ${locating ? 'animate-pulse' : ''}`} />
        {locating ? 'Locating...' : 'Navigate Me'}
      </button>
    </div>
  );
}

export default function InteractiveMap() {
  const [issues, setIssues] = useState<any[]>([]);
  const [center, setCenter] = useState<[number, number]>([13.0827, 80.2707]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMapIssues();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setCenter(loc);
        setUserLocation(loc);
      });
    }
  }, []);

  const fetchMapIssues = async () => {
    try {
      const res = await api.get('/issues?size=100');
      if (res.data.success) {
        setIssues(res.data.data.content);
      }
    } catch (error) {
      console.error("Failed to fetch issues for map", error);
    }
  };

  const getMarkerColor = (priority: string, severity: string) => {
    if (priority === 'EMERGENCY' || severity === 'CRITICAL') return '#ef4444'; // red-500
    if (priority === 'HIGH' || severity === 'HIGH') return '#f97316'; // orange-500
    return '#eab308'; // yellow-500
  };

  return (
    <div className="h-[calc(100vh-8rem)] w-full rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 relative z-0">
      <div className="absolute top-4 left-4 z-[400] glass px-4 py-2 rounded-xl">
        <h2 className="font-bold text-slate-800 dark:text-white">Live Issue Map</h2>
        <p className="text-xs text-slate-500">Showing {issues.length} active reports in your area</p>
      </div>

      <MapContainer 
        center={center} 
        zoom={12} 
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <LocateControl setUserLocation={setUserLocation} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {userLocation && (
          <Marker position={userLocation} icon={userLocationIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}
        
        {issues.map(issue => {
          if (!issue.latitude || !issue.longitude) return null;
          const color = getMarkerColor(issue.priority, issue.severity);
          
          return (
            <CircleMarker 
              key={issue.id} 
              center={[issue.latitude, issue.longitude]}
              pathOptions={{ fillColor: color, color: color, fillOpacity: 0.6, weight: 2 }}
              radius={12 + (issue.heatScore / 10)}
            >
              <Popup className="rounded-xl">
                <div className="p-1 min-w-[200px]">
                  <div className="flex gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase">{issue.status}</span>
                    <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700 text-[10px] font-bold uppercase">{issue.severity}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1 line-clamp-2">{issue.title}</h3>
                  <p className="text-xs text-slate-500 mb-3">{issue.locality?.name}</p>
                  <button 
                    onClick={() => navigate(`/report/${issue.id}`)}
                    className="w-full py-1.5 bg-primary-600 text-white text-xs font-bold rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
