import React, { useState } from 'react'
import { VolunteerLayout } from '@/components/layouts/VolunteerLayout'
import { PageHeader } from '@/components/widgets/PageHeader'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export const VolunteerReport: React.FC = () => {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <VolunteerLayout>
      <PageHeader
        title="Report Incident"
        subtitle="Quickly report issues or crowd surges to the command center."
      />

      <div className="max-w-lg mt-6">
        <div className="bg-white shadow-sm border border-[#E2E8F0] rounded-[12px]">
          <div className="p-6">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-[#1FAA6D]/10 text-[#1FAA6D] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Report Submitted</h3>
                <p className="text-[#475569]">The command center has received your report.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">Incident Type</label>
                  <select required className="w-full h-[40px] px-3 rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] text-[14px] outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors">
                    <option value="">Select type...</option>
                    <option value="medical">Medical Emergency</option>
                    <option value="security">Security Issue</option>
                    <option value="crowd">Crowd Congestion</option>
                    <option value="facility">Facility Issue (Spill, broken item)</option>
                  </select>
                </div>

                <Input name="location" label="Location / Zone" placeholder="e.g. Gate B North" required />

                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">Description</label>
                  <textarea required placeholder="Provide details..." className="w-full h-[100px] p-3 rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] text-[14px] outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors resize-none" />
                </div>

                <Button type="submit" fullWidth className="mt-2">Submit Report</Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </VolunteerLayout>
  )
}
