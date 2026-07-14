import React, { useState } from 'react';
import { Check, X, Info, AlertTriangle, ShieldAlert, ArrowUpCircle, ChevronDown } from 'lucide-react';
import type { AIRecommendation, RecommendationStatus } from '../types';

interface RecommendationCardProps {
  recommendation: AIRecommendation;
  onUpdateStatus: (id: string, status: RecommendationStatus) => void;
  defaultExpanded?: boolean;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, onUpdateStatus, defaultExpanded = false }) => {
  const isResolved = recommendation.status !== 'PENDING';
  const [isExpanded, setIsExpanded] = useState(defaultExpanded && !isResolved);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);

  // Classification styling
  const getClassStyle = (classification: string) => {
    switch(classification) {
      case 'CRITICAL': return 'bg-[#FEF2F2] text-[#991B1B] border-[#FCA5A5]';
      case 'HIGH': return 'bg-[#FFFBEB] text-[#92400E] border-[#FCD34D]';
      case 'MEDIUM': return 'bg-[#F0FDF4] text-[#166534] border-[#86EFAC]';
      case 'LOW': return 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0]';
      case 'INFO': return 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getClassIcon = (classification: string) => {
    switch(classification) {
      case 'CRITICAL': return <ShieldAlert className="w-3 h-3 mr-1" />;
      case 'HIGH': return <AlertTriangle className="w-3 h-3 mr-1" />;
      default: return <Info className="w-3 h-3 mr-1" />;
    }
  };

  return (
    <div className={`p-4 border rounded-[12px] smooth-transition ${
      isResolved 
        ? 'opacity-60 bg-[#F8FAFC] border-[#E2E8F0]' 
        : 'bg-white border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#CBD5E1]'
    }`}>
      
      {/* Header */}
      <div 
        className={`flex items-start justify-between ${!isExpanded ? 'cursor-pointer' : ''}`}
        onClick={() => { if (!isExpanded && !isResolved) setIsExpanded(true); }}
      >
        <div className="flex items-center gap-2">
          <span className={`flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold border uppercase tracking-wide ${getClassStyle(recommendation.classification)}`}>
            {getClassIcon(recommendation.classification)}
            {recommendation.classification}
          </span>
          <span className="text-[11px] font-medium text-[#64748B]">
            {recommendation.confidence}% Confidence
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#9AA3B2] font-mono">
            {new Date(recommendation.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Body */}
      <h4 
        className={`text-[14px] font-semibold mt-2 ${!isExpanded ? 'mb-0 cursor-pointer' : 'mb-1'} ${isResolved ? 'line-through text-[#64748B]' : 'text-[#0F172A]'}`}
        onClick={() => { if (!isExpanded && !isResolved) setIsExpanded(true); }}
      >
        {recommendation.title}
      </h4>
      
      {isExpanded && (
        <div className="animate-perimo-fade">
          <p className="text-[13px] text-[#475569] mb-3 leading-relaxed mt-1">
            {recommendation.explanation}
          </p>
          
          {/* Action / Impact Details */}
          {!isResolved && (
            <div className="bg-[#F8FAFC] rounded-[8px] p-3 mb-3 border border-[#E2E8F0]">
              <div className="mb-2">
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wide">Recommended Action</span>
                <p className="text-[13px] font-medium text-[#0F172A] mt-0.5">{recommendation.recommendedAction}</p>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wide">Estimated Impact</span>
                <p className="text-[12px] text-[#475569] mt-0.5">{recommendation.estimatedImpact}</p>
              </div>
            </div>
          )}

          {/* Explain Why — inline reasoning pane (per IA spec §4, §14) */}
          {!isResolved && recommendation.whyItMatters && (
            <div className="mb-3">
              <button
                onClick={() => setShowReasoning(v => !v)}
                className="flex items-center gap-1.5 text-[12px] font-medium text-[#1652F0] hover:text-[#1E3A8A] transition-colors"
              >
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showReasoning ? 'rotate-180' : ''}`} />
                {showReasoning ? 'Hide Reasoning' : 'Explain Why'}
              </button>
              {showReasoning && (
                <div className="mt-2 pl-3 border-l-2 border-[#1652F0]/30">
                  <p className="text-[12px] text-[#475569] leading-relaxed">{recommendation.whyItMatters}</p>
                </div>
              )}
            </div>
          )}

          {/* Footer / Actions */}
          <div className="flex items-center justify-between mt-2 pt-3 border-t border-[#E2E8F0]">
            {recommendation.status === 'PENDING' ? (
              <>
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="text-[12px] font-medium text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
                >
                  Collapse
                </button>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      onUpdateStatus(recommendation.id, 'REJECTED');
                      setIsExpanded(false);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] font-semibold text-[#475569] bg-white border border-[#E2E8F0] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    Dismiss
                  </button>
                  <button 
                    onClick={() => {
                      onUpdateStatus(recommendation.id, 'ESCALATED');
                      setIsExpanded(false);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] font-semibold text-[#D68A00] bg-[#D68A00]/10 border border-[#D68A00]/30 hover:bg-[#D68A00]/20 transition-colors cursor-pointer"
                  >
                    <ArrowUpCircle className="w-3.5 h-3.5" />
                    Escalate
                  </button>
                  <button 
                    onClick={() => setShowConfirmModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] font-semibold text-white bg-[#1652F0] hover:bg-[#1E3A8A] shadow-sm transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Approve
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between w-full">
                 <button 
                  onClick={() => setIsExpanded(false)}
                  className="text-[12px] font-medium text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
                >
                  Collapse
                </button>
                <div className="flex items-center gap-1.5 text-[12px] font-medium">
                  {recommendation.status === 'APPROVED' ? (
                    <span className="text-[#166534] flex items-center gap-1"><Check className="w-4 h-4" /> Workflow Executed</span>
                  ) : recommendation.status === 'ESCALATED' ? (
                    <span className="text-[#D68A00] flex items-center gap-1"><ArrowUpCircle className="w-4 h-4" /> Escalated to Supervisor</span>
                  ) : (
                    <span className="text-[#991B1B] flex items-center gap-1"><X className="w-4 h-4" /> Recommendation Dismissed</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Collapsed State Summary for Resolved Items */}
      {!isExpanded && isResolved && (
        <div className="flex items-center gap-1.5 text-[11px] font-medium mt-2">
          {recommendation.status === 'APPROVED' ? (
            <span className="text-[#166534] flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Executed</span>
          ) : (
            <span className="text-[#991B1B] flex items-center gap-1"><X className="w-3.5 h-3.5" /> Dismissed</span>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[16px] shadow-xl border border-[#E2E8F0] w-full max-w-[400px] overflow-hidden animate-perimo-fade">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-[#EFF6FF] flex items-center justify-center mb-4">
                <ShieldAlert className="w-6 h-6 text-[#1652F0]" />
              </div>
              <h3 className="text-[18px] font-semibold text-[#0F172A] mb-2">Confirm Action</h3>
              <p className="text-[14px] text-[#475569] mb-4">
                You are about to execute the following operational action:
              </p>
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] p-3 mb-6">
                <p className="text-[13px] font-medium text-[#0F172A]">{recommendation.recommendedAction}</p>
              </div>
              <div className="flex items-center justify-end gap-3">
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 rounded-[8px] text-[13px] font-medium text-[#64748B] bg-white border border-[#E2E8F0] hover:bg-[#F1F5F9] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    onUpdateStatus(recommendation.id, 'APPROVED');
                    setIsExpanded(false);
                    setShowConfirmModal(false);
                  }}
                  className="px-4 py-2 rounded-[8px] text-[13px] font-semibold text-white bg-[#1652F0] hover:bg-[#1E3A8A] transition-colors"
                >
                  Confirm & Execute
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
