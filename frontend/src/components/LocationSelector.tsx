import { useState, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import api from '../api/axios';

interface District {
  id: string;
  name: string;
}

interface Locality {
  id: string;
  name: string;
}

interface LocationSelectorProps {
  selectedDistrictId: string | null;
  selectedLocalityId: string | null;
  onLocationChange: (districtId: string | null, localityId: string | null) => void;
}

export default function LocationSelector({ 
  selectedDistrictId, 
  selectedLocalityId, 
  onLocationChange 
}: LocationSelectorProps) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    api.get('/locations/districts').then(res => {
      setDistricts(res.data.data);
    });
  }, []);

  useEffect(() => {
    if (selectedDistrictId) {
      api.get(`/locations/districts/${selectedDistrictId}/localities`).then(res => {
        setLocalities(res.data.data);
      });
    } else {
      setLocalities([]);
    }
  }, [selectedDistrictId]);

  const selectedDistrict = districts.find(d => d.id === selectedDistrictId);
  const selectedLocality = localities.find(l => l.id === selectedLocalityId);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-700 dark:text-slate-300 text-sm font-medium"
      >
        <MapPin className="w-4 h-4 text-primary-500" />
        <span>
          {selectedLocality ? `${selectedLocality.name}, ` : ''}
          {selectedDistrict ? selectedDistrict.name : 'All of Tamil Nadu'}
        </span>
        <ChevronDown className="w-4 h-4 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 glass rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-50 p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">District</label>
              <select 
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
                value={selectedDistrictId || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  onLocationChange(val || null, null);
                }}
              >
                <option value="">All Districts</option>
                {districts.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {selectedDistrictId && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Locality</label>
                <select 
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
                  value={selectedLocalityId || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    onLocationChange(selectedDistrictId, val || null);
                    if (val) setIsOpen(false); // Close on locality selection
                  }}
                >
                  <option value="">All Localities</option>
                  {localities.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
            )}
            
            <button 
              onClick={() => setIsOpen(false)}
              className="w-full py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
