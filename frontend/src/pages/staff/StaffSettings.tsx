import React, { useState } from 'react'
import { StaffLayout } from '@/components/layouts/StaffLayout'
import { PageHeader, WidgetCard } from '@/components/widgets'
import { Settings, Bell, MapPin, Moon, Shield, Save } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'

export const StaffSettings: React.FC = () => {
  const { toast } = useApp()
  const [notifications, setNotifications] = useState(true)
  const [locationServices, setLocationServices] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  const handleSave = () => {
    toast({ type: 'success', title: 'Settings Saved', message: 'Your preferences have been updated.' })
  }

  return (
    <StaffLayout>
      <PageHeader title="Settings" subtitle="Manage your application preferences." />

      <div className="max-w-3xl mx-auto">
        <WidgetCard title="Preferences" icon={Settings} iconColor="#475569">
          
          <div className="flex flex-col gap-6">
            
            {/* Toggles */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#0F172A]">Push Notifications</h4>
                    <p className="text-[12px] text-[#64748B]">Receive alerts and assignment updates.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#0F172A]">Location Services</h4>
                    <p className="text-[12px] text-[#64748B]">Allow app to track your location during shifts.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={locationServices} onChange={(e) => setLocationServices(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#0F172A]">Dark Mode</h4>
                    <p className="text-[12px] text-[#64748B]">Switch application theme.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Account Settings */}
            <div className="pt-6 border-t border-[#E2E8F0]">
              <h3 className="text-[15px] font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#64748B]" /> Account Security
              </h3>
              <div className="flex flex-col gap-4">
                <button onClick={() => toast({ type: 'info', title: 'Change password', message: 'A password reset link has been sent to your registered email.' })} className="h-10 px-4 rounded-[8px] border border-[#E2E8F0] bg-white text-[#0F172A] text-[13px] font-medium hover:bg-[#F8FAFC] transition-colors text-left w-full sm:w-auto outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]">
                  Change Password
                </button>
                <button onClick={() => toast({ type: 'info', title: 'Two-factor authentication', message: '2FA management opens here in the full release.' })} className="h-10 px-4 rounded-[8px] border border-[#E2E8F0] bg-white text-[#0F172A] text-[13px] font-medium hover:bg-[#F8FAFC] transition-colors text-left w-full sm:w-auto outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]">
                  Manage Two-Factor Authentication
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E2E8F0] flex justify-end">
              <button onClick={handleSave} className="h-11 px-8 rounded-[8px] bg-[#2563EB] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#1D4ED8] transition-colors">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>

          </div>
        </WidgetCard>
      </div>

    </StaffLayout>
  )
}
