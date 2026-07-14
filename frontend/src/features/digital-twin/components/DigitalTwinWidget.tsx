import React, { useState, useEffect, useRef } from 'react';
import { MonitorSmartphone, AlertTriangle, Activity } from 'lucide-react';
import { LiveMap } from './LiveMap';
import { useLiveUpdates } from '../hooks/useLiveUpdates';

export const DigitalTwinWidget: React.FC = () => {
  const { units, gates, thermal, crowdFlows, connectionStatus, latency } = useLiveUpdates();
  const [layerMode, setLayerMode] = useState<'Physical' | 'Thermal' | 'Crowd Flow'>('Physical');
  const [floor, setFloor] = useState<'L3' | 'L2' | 'L1' | 'P1'>('L1');
  const [zoom, setZoom] = useState(17);
  const [isVisible, setIsVisible] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading mapbox to save resources
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (widgetRef.current) {
      observer.observe(widgetRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 1, 21));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 1, 10));

  return (
    <div ref={widgetRef} className="bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-[10px] bg-[#F1F5F9] flex items-center justify-center shrink-0">
          <MonitorSmartphone className="w-5 h-5 text-[#64748B]" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-[20px] font-display font-semibold text-[#0F172A] m-0 tracking-[-0.01em]">Live Stadium Digital Twin</h2>
          <p className="text-[14px] text-[#64748B] m-0 mt-1">Real-time mapping and asset tracking</p>
        </div>
      </div>

      {/* Map Container — aspect-video (16:9) locks the ratio to the card's own
          rendered width at every breakpoint, instead of a fixed pixel height
          that would drift toward square (narrow viewports) or ultra-wide
          (capped max-w) as width changes. */}
      <div className="w-full aspect-video bg-[#F8FAFC] rounded-[12px] border border-[#E2E8F0] flex items-center justify-center relative overflow-hidden">
        
        {isVisible && (
          <LiveMap 
            units={units}
            gates={gates}
            thermal={thermal}
            crowdFlows={crowdFlows}
            isVisible={isVisible} 
            layerMode={layerMode}
            floor={floor}
            zoom={zoom}
          />
        )}
        
        {/* Connection Lost Banner */}
        {connectionStatus === 'disconnected' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <div className="bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-[13px] font-medium animate-in fade-in slide-in-from-top-4 duration-300">
              <AlertTriangle className="w-4 h-4" />
              Live connection lost. Attempting reconnect...
            </div>
          </div>
        )}

        {/* Mock Simulation Banner */}
        {connectionStatus === 'mock' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <div className="bg-[#F0FDF4] border border-[#86EFAC] text-[#166534] px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-[13px] font-medium animate-in fade-in slide-in-from-top-4 duration-300">
              <Activity className="w-4 h-4" />
              Simulation Mode
            </div>
          </div>
        )}

        {/* Toolbars Overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none p-4 flex flex-col justify-between">
          
          {/* Top Controls */}
          <div className="flex items-start justify-between w-full">
            {/* Left: Map Layers */}
            <div className="flex bg-white shadow-sm border border-[#E2E8F0] rounded-[8px] pointer-events-auto overflow-hidden">
              {(['Physical', 'Thermal', 'Crowd Flow'] as const).map(mode => (
                <button 
                  key={mode}
                  onClick={() => setLayerMode(mode)}
                  className={`px-3 h-8 text-[12px] font-medium transition-colors border-r border-[#E2E8F0] last:border-r-0 ${
                    layerMode === mode 
                      ? 'text-[#0F172A] bg-[#F1F5F9] hover:bg-[#E2E8F0]' 
                      : 'text-[#64748B] bg-white hover:bg-[#F8FAFC]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Right: Zoom Actions */}
            <div className="flex flex-col bg-white shadow-sm border border-[#E2E8F0] rounded-[8px] pointer-events-auto overflow-hidden">
              <button onClick={handleZoomIn} className="w-8 h-8 flex items-center justify-center text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors border-b border-[#E2E8F0]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><path d="m3 12 18 0"/></svg>
              </button>
              <button onClick={handleZoomOut} className="w-8 h-8 flex items-center justify-center text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18"/></svg>
              </button>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="flex items-end justify-between w-full">
            {/* Left: Connection Status */}
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md shadow-[0_1px_2px_rgba(0,0,0,0.04)] border border-[#E2E8F0] px-2.5 py-1.5 rounded-[6px] pointer-events-auto">
              <span className={`w-1.5 h-1.5 rounded-full ${
                connectionStatus === 'connected' ? 'bg-[#1FAA6D] animate-perimo-pulse' : 
                connectionStatus === 'mock' ? 'bg-[#D68A00] animate-perimo-pulse' :
                'bg-red-500'
              }`} />
              <span className="text-[11px] font-medium text-[#475569] font-mono">
                {connectionStatus === 'connected' ? `WSS: Connected (${latency}ms)` : 
                 connectionStatus === 'mock' ? `WSS: Mock Fallback` :
                 'WSS: Disconnected'}
              </span>
            </div>

            {/* Right: Floor Selector */}
            <div className="flex flex-col bg-white shadow-sm border border-[#E2E8F0] rounded-[8px] pointer-events-auto overflow-hidden">
              {(['L3', 'L2', 'L1', 'P1'] as const).map(f => (
                <button 
                  key={f}
                  onClick={() => setFloor(f)}
                  className={`w-8 h-8 text-[12px] font-medium transition-colors border-b border-[#E2E8F0] last:border-b-0 ${
                    floor === f
                      ? 'text-[#0F172A] bg-[#F1F5F9]'
                      : 'text-[#64748B] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
