import React from 'react';
import { Building2, Settings, Users, Plus, Check, MapPin, Shield } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useOverlay } from '@/contexts/OverlayContext';
import { useApp, WORKSPACES, ROLES } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';

const ENV_COLOR = {
  Production: 'text-[#1FAA6D]',
  Staging: 'text-[#D68A00]',
  Setup: 'text-[#64748B]',
};

export const WorkspaceSwitcher: React.FC = () => {
  const { isOpen, toggle, containerRef } = useOverlay('role-switcher');
  const { activeWorkspace, switchWorkspace, activeRole, switchRole, toast } = useApp();
  const navigate = useNavigate();

  const handleSwitchWorkspace = (id: string) => {
    if (id === activeWorkspace.id) return;
    switchWorkspace(id);
    const ws = WORKSPACES.find(w => w.id === id);
    toast({ type: 'success', title: 'Workspace Switched', message: `Now operating: ${ws?.name}` });
    toggle();
  };

  const handleSwitchRole = (id: string) => {
    if (id === activeRole.id) return;
    switchRole(id);
    const role = ROLES.find(r => r.id === id);
    toast({ type: 'info', title: 'Role Switched', message: `Now acting as: ${role?.name}` });
    toggle();
  };

  const handleWorkspaceSettings = () => {
    toggle();
    navigate('/admin/workspace');
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={toggle}
        className={cn(
          'flex items-center gap-2.5 p-1.5 rounded-[8px] transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]',
          isOpen ? 'bg-[#F1F5F9]' : 'hover:bg-[#F1F5F9]'
        )}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <Logo showText={true} />
      </button>

      {isOpen && (
        <div
          className="absolute top-[48px] left-0 w-[300px] bg-white border border-[#E2E8F0] rounded-[16px] shadow-[0_12px_32px_rgba(11,14,20,0.16)] flex flex-col z-[150] animate-in fade-in zoom-in-95 duration-150 origin-top-left"
          role="menu"
        >
          {/* Current Workspace Info */}
          <div className="p-3 border-b border-[#E2E8F0] flex items-center gap-3 bg-[#F8FAFC] rounded-t-[15px]">
            <div className="w-10 h-10 rounded-[8px] bg-gradient-to-br from-[#0F172A] to-[#334155] flex items-center justify-center shadow-sm shrink-0">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[14px] font-semibold text-[#0F172A] truncate">{activeWorkspace.name}</span>
              <span className={cn('text-[12px] font-medium flex items-center gap-1', ENV_COLOR[activeWorkspace.env])}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {activeWorkspace.env}
              </span>
            </div>
          </div>

          <div className="max-h-[380px] overflow-y-auto p-1.5">
            {/* Switch Workspace */}
            <div className="px-2 pt-2 pb-1.5">
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Switch Workspace</span>
            </div>
            <div className="flex flex-col gap-0.5 mb-1">
              {WORKSPACES.map(ws => (
                <button
                  key={ws.id}
                  onClick={() => handleSwitchWorkspace(ws.id)}
                  className={cn(
                    'flex items-center gap-3 w-full text-left px-2 py-1.5 rounded-[8px] transition-colors outline-none',
                    ws.id === activeWorkspace.id ? 'bg-[#F8FAFC]' : 'hover:bg-[#F1F5F9] focus-visible:bg-[#F1F5F9]'
                  )}
                  role="menuitem"
                >
                  <div className={cn('flex items-center justify-center w-6 h-6 rounded-[6px] shrink-0', ws.id === activeWorkspace.id ? 'bg-white border border-[#E2E8F0] shadow-sm' : 'bg-[#F1F5F9] text-[#64748B]')}>
                    <MapPin className={cn('w-3.5 h-3.5', ws.id === activeWorkspace.id && 'text-[#2563EB]')} />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className={cn('text-[13px] font-medium truncate', ws.id === activeWorkspace.id ? 'text-[#0F172A]' : 'text-[#475569]')}>{ws.name}</span>
                    <span className={cn('text-[11px]', ENV_COLOR[ws.env])}>{ws.env}</span>
                  </div>
                  {ws.id === activeWorkspace.id && <Check className="w-4 h-4 text-[#2563EB] shrink-0" />}
                </button>
              ))}
              <button className="flex items-center gap-3 w-full text-left px-2 py-1.5 rounded-[8px] transition-colors outline-none hover:bg-[#F1F5F9] text-[#64748B]">
                <div className="flex items-center justify-center w-6 h-6 rounded-[6px] bg-[#F1F5F9] shrink-0">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                <span className="text-[13px] font-medium truncate">Create new workspace...</span>
              </button>
            </div>

            <div className="h-px bg-[#E2E8F0] mx-1 my-1.5" />

            {/* Switch Role */}
            <div className="px-2 pt-1.5 pb-1">
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Switch Role</span>
            </div>
            <div className="flex flex-col gap-0.5">
              {ROLES.map(role => (
                <button
                  key={role.id}
                  onClick={() => handleSwitchRole(role.id)}
                  className={cn(
                    'flex items-center gap-3 w-full text-left px-2 py-1.5 rounded-[8px] transition-colors outline-none',
                    role.id === activeRole.id ? 'bg-[#F8FAFC]' : 'hover:bg-[#F1F5F9] focus-visible:bg-[#F1F5F9]'
                  )}
                  role="menuitem"
                >
                  <div className={cn('flex items-center justify-center w-6 h-6 rounded-[6px] shrink-0', role.id === activeRole.id ? 'bg-white border border-[#E2E8F0] shadow-sm' : 'bg-[#F1F5F9] text-[#64748B]')}>
                    <Shield className={cn('w-3.5 h-3.5', role.id === activeRole.id && 'text-[#2563EB]')} />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className={cn('text-[13px] font-medium truncate', role.id === activeRole.id ? 'text-[#0F172A]' : 'text-[#475569]')}>{role.name}</span>
                    <span className="text-[11px] text-[#94A3B8] truncate">{role.description}</span>
                  </div>
                  {role.id === activeRole.id && <Check className="w-4 h-4 text-[#2563EB] shrink-0" />}
                </button>
              ))}
            </div>

            <div className="h-px bg-[#E2E8F0] mx-1 my-1.5" />

            {/* Actions */}
            <div className="flex flex-col gap-0.5">
              <button
                onClick={handleWorkspaceSettings}
                className="flex items-center gap-2.5 px-2 py-1.5 w-full text-left rounded-[8px] text-[13px] text-[#475569] font-medium hover:bg-[#F1F5F9] transition-colors"
              >
                <Settings className="w-4 h-4 text-[#64748B]" /> Workspace Settings
              </button>
              <button className="flex items-center gap-2.5 px-2 py-1.5 w-full text-left rounded-[8px] text-[13px] text-[#475569] font-medium hover:bg-[#F1F5F9] transition-colors">
                <Users className="w-4 h-4 text-[#64748B]" /> Manage Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
