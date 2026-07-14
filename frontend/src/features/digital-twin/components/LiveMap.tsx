import React, { useEffect, useRef } from 'react';
import { useGoogleMaps } from '../hooks/useGoogleMaps';
import { BERNA_COORDS } from '../utils/mapHelpers';
import type { MobileUnit, GateThroughput, ThermalData, CrowdFlowPath } from '../types';

interface LiveMapProps {
  units: MobileUnit[];
  gates: GateThroughput[];
  thermal: ThermalData[];
  crowdFlows: CrowdFlowPath[];
  isVisible: boolean;
  layerMode: 'Physical' | 'Thermal' | 'Crowd Flow';
  floor: 'L3' | 'L2' | 'L1' | 'P1';
  zoom: number;
}

export const LiveMap: React.FC<LiveMapProps> = ({ units, gates, thermal, crowdFlows, layerMode, floor, zoom }) => {
  const containerId = 'perimo-live-map';
  
  const { map, isLoaded, error, retry } = useGoogleMaps({
    containerId,
    center: BERNA_COORDS,
    interactive: true,
  });

  const markersRef = useRef<Record<string, { marker: google.maps.marker.AdvancedMarkerElement, el: HTMLDivElement }>>({});
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const thermalCirclesRef = useRef<google.maps.Circle[]>([]);
  const gatePolygonsRef = useRef<Record<string, google.maps.Polygon>>({});
  const crowdLinesRef = useRef<Record<string, google.maps.Polyline>>({});
  const animationFrameRef = useRef<number>(0);

  // Sync zoom
  useEffect(() => {
    if (map && isLoaded) {
      map.setZoom(zoom);
    }
  }, [zoom, map, isLoaded]);

  // Init InfoWindow
  useEffect(() => {
    if (!map || !isLoaded) return;
    infoWindowRef.current = new google.maps.InfoWindow({
      pixelOffset: new google.maps.Size(0, -10),
    });
  }, [map, isLoaded]);

  // Handle Layer Modes (Thermal fade in/out)
  useEffect(() => {
    if (!map) return;
    
    if (layerMode === 'Thermal') {
      thermalCirclesRef.current.forEach(c => {
        c.setMap(map);
        c.setOptions({ fillOpacity: 0.5, strokeOpacity: 0 });
      });
    } else {
      thermalCirclesRef.current.forEach(c => {
        c.setOptions({ fillOpacity: 0, strokeOpacity: 0 });
      });
      setTimeout(() => {
        thermalCirclesRef.current.forEach(c => c.setMap(null));
      }, 300);
    }
  }, [layerMode, map]);

  // Render Thermal Data
  useEffect(() => {
    if (layerMode !== 'Thermal' || !map) return;
    
    // Clear old circles
    thermalCirclesRef.current.forEach(c => c.setMap(null));
    thermalCirclesRef.current = [];

    const visibleThermal = thermal.filter(t => t.floor === floor);
    
    visibleThermal.forEach(t => {
      const circle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0,
        strokeWeight: 0,
        fillColor: '#FF0000',
        fillOpacity: 0.5,
        map,
        center: { lat: t.position.lat, lng: t.position.lng },
        radius: t.weight * 15 // Scale radius by weight
      });
      thermalCirclesRef.current.push(circle);
    });
  }, [thermal, floor, layerMode, map]);

  // Render Gates (Physical Layer)
  useEffect(() => {
    if (!map || !isLoaded) return;

    const visibleGates = gates.filter(g => g.floor === floor);
    
    // Clear old gates
    Object.values(gatePolygonsRef.current).forEach(p => p.setMap(null));
    gatePolygonsRef.current = {};

    if (layerMode !== 'Physical') return; // Only show in physical for now

    visibleGates.forEach(gate => {
      // Create a small polygon (square) around the gate position
      const d = 0.0002;
      const paths = [
        { lat: gate.position.lat - d, lng: gate.position.lng - d },
        { lat: gate.position.lat - d, lng: gate.position.lng + d },
        { lat: gate.position.lat + d, lng: gate.position.lng + d },
        { lat: gate.position.lat + d, lng: gate.position.lng - d },
      ];

      let fillColor = '#1FAA6D'; // Normal
      if (gate.waitLevel === 'medium') fillColor = '#D68A00';
      if (gate.waitLevel === 'high') fillColor = '#C4291C';

      const polygon = new google.maps.Polygon({
        paths,
        strokeColor: fillColor,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: fillColor,
        fillOpacity: 0.35,
        map
      });

      gatePolygonsRef.current[gate.gateId] = polygon;
      
      // Gate click InfoWindow
      google.maps.event.addListener(polygon, 'click', () => {
         if (infoWindowRef.current) {
            infoWindowRef.current.setPosition(gate.position);
            infoWindowRef.current.setContent(`
              <div style="padding:4px; min-width:150px; font-family:inherit;">
                <h4 style="margin:0 0 4px 0; font-size:13px; font-weight:600; color:#0f172a;">${gate.gateId}</h4>
                <div style="font-size:11px; color:#64748b;">Occupancy: ${gate.occupancy}/${gate.capacity}</div>
                <div style="font-size:11px; color:#64748b;">Flow Rate: ${gate.flowRate} ppm</div>
                <div style="margin-top:8px; padding-top:8px; border-top:1px solid #e2e8f0; font-size:11px; color:${fillColor}; font-weight:600;">Status: ${gate.securityStatus.toUpperCase()}</div>
              </div>
            `);
            infoWindowRef.current.open(map);
         }
      });
    });
  }, [gates, floor, layerMode, map, isLoaded]);

  // Render Crowd Flows (Animated Polylines)
  useEffect(() => {
    if (!map || !isLoaded) return;

    const visibleFlows = crowdFlows.filter(cf => cf.floor === floor);
    
    // Clear old lines
    Object.values(crowdLinesRef.current).forEach(l => l.setMap(null));
    crowdLinesRef.current = {};

    if (layerMode !== 'Crowd Flow') return;

    visibleFlows.forEach(flow => {
      let color = '#3b82f6';
      if (flow.density === 'medium') color = '#f59e0b';
      if (flow.density === 'high') color = '#ef4444';

      const lineSymbol = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 3,
        strokeColor: color
      };

      const polyline = new google.maps.Polyline({
        path: flow.path,
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 0.5,
        strokeWeight: 4,
        icons: [{
          icon: lineSymbol,
          offset: '100%'
        }],
        map
      });

      crowdLinesRef.current[flow.id] = polyline;
    });
    
    // Animate lines
    let offset = 0;
    const animate = () => {
      offset = (offset + 1) % 100;
      Object.values(crowdLinesRef.current).forEach(line => {
        const icons = line.get('icons');
        if (icons) {
          icons[0].offset = offset + '%';
          line.set('icons', icons);
        }
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [crowdFlows, floor, layerMode, map, isLoaded]);

  // Sync unit markers with interpolation
  useEffect(() => {
    if (!map || !isLoaded) return;

    google.maps.importLibrary("marker").then(({ AdvancedMarkerElement }) => {
      
      const visibleUnits = units.filter(u => u.floor === floor);
      const visibleUnitIds = new Set(visibleUnits.map(u => u.id));

      // Hide/Remove markers not on this floor
      Object.keys(markersRef.current).forEach(id => {
        if (!visibleUnitIds.has(id)) {
          markersRef.current[id].marker.map = null;
          delete markersRef.current[id];
        }
      });

      visibleUnits.forEach(unit => {
        let entry = markersRef.current[unit.id];

        let bgColor = '#1652F0';
        if (unit.type === 'security') bgColor = '#1FAA6D';
        if (unit.type === 'medical') bgColor = '#C4291C';
        if (unit.type === 'police') bgColor = '#1E3A8A';
        
        if (unit.status === 'busy') bgColor = '#D68A00'; // Override color for busy

        if (entry) {
          // Smooth animate position (naive lerp for demonstration, typically use requestAnimationFrame for true 60fps)
          // Since AdvancedMarkerElement respects DOM transitions if we animate the lat/lng internally,
          // it's tricky without a custom OverlayView. We will just set it for now, 
          // but add a CSS transition to the marker DOM element to smooth out any internal snap if supported.
          entry.marker.position = { lat: unit.position.lat, lng: unit.position.lng };
          entry.el.style.backgroundColor = bgColor;
        } else {
          const el = document.createElement('div');
          el.className = 'w-3 h-3 rounded-full border-2 border-white shadow-[0_0_8px_rgba(0,0,0,0.5)] cursor-pointer transition-all duration-700 hover:scale-125 hover:shadow-lg relative group';
          el.style.backgroundColor = bgColor;

          // Tooltip (Hover)
          const tooltip = document.createElement('div');
          tooltip.className = 'absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white text-[10px] font-medium px-2 py-1 rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50';
          tooltip.innerText = `${unit.type.toUpperCase()} - ${unit.id}`;
          el.appendChild(tooltip);

          const marker = new AdvancedMarkerElement({
            map,
            position: { lat: unit.position.lat, lng: unit.position.lng },
            content: el,
            title: `Unit: ${unit.id}`
          });

          // Click panel
          el.addEventListener('click', () => {
            if (infoWindowRef.current) {
              const contentString = `
                <div style="font-family: inherit; padding: 4px; min-width: 140px; animation: slideIn 0.2s ease-out;">
                  <style>
                    @keyframes slideIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
                  </style>
                  <div style="font-size: 13px; font-weight: 600; color: #0f172a; margin-bottom: 4px;">Unit ${unit.id}</div>
                  <div style="font-size: 11px; color: #64748b; margin-bottom: 8px; text-transform: capitalize;">Role: ${unit.type}</div>
                  <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 8px;">
                    <span style="font-size: 11px; font-weight: 500; color: #475569;">Status</span>
                    <span style="font-size: 10px; font-weight: 600; color: ${unit.status === 'active' ? '#1FAA6D' : '#D68A00'}; background: ${unit.status === 'active' ? '#1FAA6D1a' : '#D68A001a'}; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">${unit.status}</span>
                  </div>
                </div>
              `;
              infoWindowRef.current.setContent(contentString);
              infoWindowRef.current.open(map, marker);
            }
          });

          markersRef.current[unit.id] = { marker, el };
        }
      });
    });
  }, [units, map, isLoaded, floor]);

  if (error) {
    return (
      <div className="absolute inset-0 z-20 bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-[#E2E8F0] m-4 rounded-[12px] shadow-sm">
         <div className="w-12 h-12 bg-[#FEF2F2] rounded-[10px] flex items-center justify-center mb-4 border border-[#FCA5A5]">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
         </div>
         <h4 className="text-[14px] font-semibold text-[#0F172A] mb-1">Mapping Service Unavailable</h4>
         <p className="text-[13px] text-[#64748B] max-w-sm mb-5">
           {error}
         </p>
         <button 
           onClick={retry}
           className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#0F172A] text-[13px] font-medium rounded-[8px] hover:bg-[#F1F5F9] transition-colors shadow-sm active:scale-95"
         >
           Retry Connection
         </button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full bg-[#F8FAFC]">
      <div id={containerId} className={`w-full h-full transition-opacity duration-1000 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
      
      {/* Loading Skeleton Transition */}
      <div className={`absolute inset-0 z-10 bg-[#F8FAFC] flex flex-col items-center justify-center transition-opacity duration-700 pointer-events-none ${isLoaded ? 'opacity-0' : 'opacity-100'}`}>
         <svg width="240" height="240" viewBox="0 0 48 48" fill="none" className="text-[#1652F0] opacity-[0.05] absolute">
          <path d="M40.42 28.4 A17 17 0 1 1 28.4 7.58" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none"/>
          <circle cx="38.72" cy="15.5" r="3.2" fill="currentColor"/>
        </svg>
        <div className="flex items-center gap-3 z-20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1652F0] animate-perimo-pulse" />
          <span className="text-[13px] text-[#64748B] font-medium tracking-wide uppercase">Initializing Stadium Twin...</span>
        </div>
      </div>
    </div>
  );
};
