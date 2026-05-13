import { useState } from 'react'
import { Plus, Edit2, UserX, UserCheck, Activity } from 'lucide-react'
import { StatusBadge } from '../components/ui/StatusBadge'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { useAdminToast, AdminToastContainer } from '../components/ui/AdminToast'
import { MOCK_STAFF, MOCK_AUDIT_LOGS } from '../data/mockData'
import { useAdminStore, roleLabel } from '../store/useAdminStore'
import { RBAC } from '../types/admin'
import type { StaffMember, AdminRole } from '../types/admin'

const MODULES = ['dashboard', 'products', 'categories', 'inventory', 'brands', 'orders', 'returns', 'coupons', 'customers', 'loyalty', 'banners', 'search', 'analytics', 'staff', 'settings']
const ROLES: AdminRole[] = ['super_admin', 'catalogue_mgr', 'order_mgr', 'support_agent']

export function StaffPage() {
  const { adminUser } = useAdminStore()
  const { toasts, show } = useAdminToast()
  const [staff, setStaff] = useState<StaffMember[]>(MOCK_STAFF)
  const [activeTab, setActiveTab] = useState<'list' | 'matrix' | 'log'>('list')
  const [showForm, setShowForm] = useState(false)
  const [editStaff, setEditStaff] = useState<StaffMember | null>(null)
  const [suspendTarget, setSuspendTarget] = useState<StaffMember | null>(null)

  const isSuperAdmin = adminUser?.role === 'super_admin'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Staff & Roles</h2>
        {isSuperAdmin && (
          <button onClick={() => { setEditStaff(null); setShowForm(true) }}
            className="flex items-center gap-2 px-4 py-2 bg-[#C0001D] text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors">
            <Plus size={16} /> Add Staff
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex border-b border-gray-100">
          {([['list', 'Staff List'], ['matrix', 'Permissions Matrix'], ['log', 'Activity Log']] as const).map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === key ? 'border-[#C0001D] text-[#C0001D]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === 'list' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Staff Member', 'Email', 'Role', 'Last Active', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {staff.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#1A1A2E] flex items-center justify-center text-white text-xs font-bold">
                            {s.name.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">{s.name}</span>
                          {s.id === adminUser?.uid && <span className="text-xs text-gray-400">(you)</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{s.email}</td>
                      <td className="px-4 py-3">
                        {isSuperAdmin && s.id !== adminUser?.uid ? (
                          <select value={s.role} onChange={e => {
                            setStaff(ss => ss.map(x => x.id === s.id ? { ...x, role: e.target.value as AdminRole } : x))
                            show('Role updated', 'success')
                          }} className="px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none">
                            {ROLES.map(r => <option key={r} value={r}>{roleLabel(r)}</option>)}
                          </select>
                        ) : (
                          <span className="text-sm text-gray-700">{roleLabel(s.role)}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{s.lastActive}</td>
                      <td className="px-4 py-3"><StatusBadge status={s.status} size="sm" /></td>
                      <td className="px-4 py-3">
                        {isSuperAdmin && s.id !== adminUser?.uid && (
                          <div className="flex items-center gap-1">
                            <button onClick={() => { setEditStaff(s); setShowForm(true) }} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => setSuspendTarget(s)} className={`p-1.5 rounded-lg transition-colors ${s.status === 'suspended' ? 'text-gray-400 hover:text-green-600 hover:bg-green-50' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}>
                              {s.status === 'suspended' ? <UserCheck size={14} /> : <UserX size={14} />}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'matrix' && (
            <div className="overflow-x-auto">
              <table className="text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 w-36">Module</th>
                    {ROLES.map(r => <th key={r} className="px-4 py-3 text-center font-medium text-gray-500 whitespace-nowrap">{roleLabel(r)}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MODULES.map(mod => (
                    <tr key={mod} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-700 capitalize">{mod.replace('_', ' ')}</td>
                      {ROLES.map(role => {
                        const perm = RBAC[mod]?.[role] ?? 'none'
                        return (
                          <td key={role} className="px-4 py-3 text-center">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                              perm === 'full' ? 'bg-green-100 text-green-700' :
                              perm === 'view' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-400'
                            }`}>
                              {perm === 'none' ? '—' : perm}
                            </span>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'log' && (
            <div className="space-y-2">
              {MOCK_AUDIT_LOGS.map(log => (
                <div key={log.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[#1A1A2E] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {log.staffName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-gray-900">{log.staffName}</span>
                      <span className="text-xs px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded font-medium capitalize">{log.module}</span>
                      <span className="text-xs text-gray-500">{log.action}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{log.details}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{log.timestamp} · Record: {log.recordId}</p>
                  </div>
                  <Activity size={14} className="text-gray-300 shrink-0 mt-1" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <StaffFormModal
          staff={editStaff}
          onClose={() => setShowForm(false)}
          onSave={(s) => {
            if (editStaff) {
              setStaff(ss => ss.map(x => x.id === s.id ? s : x))
              show('Staff updated', 'success')
            } else {
              setStaff(ss => [...ss, { ...s, id: `S${Date.now()}`, lastActive: 'Never', status: 'active', joinedDate: new Date().toISOString().split('T')[0] }])
              show('Staff invited', 'success')
            }
            setShowForm(false)
          }}
        />
      )}

      <ConfirmModal
        open={suspendTarget !== null}
        title={suspendTarget?.status === 'suspended' ? 'Activate Account' : 'Suspend Account'}
        message={`Are you sure you want to ${suspendTarget?.status === 'suspended' ? 'activate' : 'suspend'} ${suspendTarget?.name}?`}
        confirmLabel={suspendTarget?.status === 'suspended' ? 'Activate' : 'Suspend'}
        onConfirm={() => {
          if (suspendTarget) {
            setStaff(ss => ss.map(s => s.id === suspendTarget.id ? { ...s, status: s.status === 'suspended' ? 'active' : 'suspended' } : s))
            show(`Account ${suspendTarget.status === 'suspended' ? 'activated' : 'suspended'}`, 'success')
          }
        }}
        onCancel={() => setSuspendTarget(null)}
      />
      <AdminToastContainer toasts={toasts} onDismiss={() => {}} />
    </div>
  )
}

function StaffFormModal({ staff, onClose, onSave }: { staff: StaffMember | null; onClose: () => void; onSave: (s: StaffMember) => void }) {
  const [form, setForm] = useState<Partial<StaffMember>>(staff ?? { name: '', email: '', role: 'support_agent' })
  const [sendInvite, setSendInvite] = useState(true)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-5">{staff ? 'Edit Staff' : 'Add Staff Member'}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
            <input value={form.name ?? ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C0001D]/20 focus:border-[#C0001D]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Work Email</label>
            <input type="email" value={form.email ?? ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C0001D]/20 focus:border-[#C0001D]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
            <select value={form.role ?? 'support_agent'} onChange={e => setForm(f => ({ ...f, role: e.target.value as AdminRole }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
              {ROLES.map(r => <option key={r} value={r}>{roleLabel(r)}</option>)}
            </select>
          </div>
          {!staff && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={sendInvite} onChange={e => setSendInvite(e.target.checked)} className="rounded" />
              <span className="text-sm text-gray-700">Send invite email with setup link</span>
            </label>
          )}
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave(form as StaffMember)} className="flex-1 py-2 text-sm font-medium text-white bg-[#C0001D] rounded-lg hover:bg-red-800">
            {staff ? 'Save Changes' : 'Send Invite'}
          </button>
        </div>
      </div>
    </div>
  )
}
