import { useState } from 'react'
import { Save, AlertTriangle, Eye, EyeOff } from 'lucide-react'
import { useAdminToast, AdminToastContainer } from '../components/ui/AdminToast'

const TAX_RATES = [
  { category: 'Women Ethnic Wear', gst: 5 },
  { category: 'Men Formal Wear', gst: 12 },
  { category: 'Footwear', gst: 18 },
  { category: 'Beauty & Skincare', gst: 18 },
  { category: 'Home & Decor', gst: 12 },
  { category: 'Kids Wear', gst: 5 },
]

const EMAIL_TEMPLATES = ['Order Confirmed', 'Order Shipped', 'Order Delivered', 'OTP Verification', 'Welcome Email']

const FEATURE_FLAGS = [
  { key: 'buy_now_pay_later', label: 'Buy Now Pay Later', enabled: true },
  { key: 'gift_cards', label: 'Gift Cards', enabled: false },
  { key: 'store_locator', label: 'Store Locator', enabled: true },
  { key: 'wishlist', label: 'Wishlist', enabled: true },
  { key: 'product_reviews', label: 'Product Reviews', enabled: true },
  { key: 'try_at_home', label: 'Try at Home', enabled: false },
]

export function SettingsPage() {
  const { toasts, show } = useAdminToast()
  const [activeSection, setActiveSection] = useState('general')
  const [taxRates, setTaxRates] = useState(TAX_RATES)
  const [featureFlags, setFeatureFlags] = useState(FEATURE_FLAGS)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [maintenanceMsg, setMaintenanceMsg] = useState('We are performing scheduled maintenance. Back shortly!')
  const [showRazorpay, setShowRazorpay] = useState(false)
  const [liveMode, setLiveMode] = useState(false)

  const SECTIONS = [
    'General', 'Payment Gateways', 'Delivery Partners', 'Tax Config',
    'Email Templates', 'SMS & Push', 'Maintenance Mode', 'Feature Flags'
  ]

  const renderSection = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-4 max-w-lg">
            {[
              { label: 'Store Name', value: "Shoppers Stop" },
              { label: 'Contact Email', value: 'support@shoppersstop.com' },
              { label: 'Support Number', value: '+91-22-6199-1000' },
              { label: 'GST Number', value: '27AACCS4699N1ZU' },
              { label: 'Registered Address', value: 'Shoppers Stop Ltd, Raghuleela Mall, Vashi, Navi Mumbai 400703' },
            ].map(({ label, value }) => (
              <div key={label}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input defaultValue={value} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C0001D]/20 focus:border-[#C0001D]" />
              </div>
            ))}
            <button onClick={() => show('General settings saved', 'success')} className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-[#C0001D] rounded-lg hover:bg-red-800">
              <Save size={14} /> Save
            </button>
          </div>
        )

      case 'payment-gateways':
        return (
          <div className="space-y-5 max-w-lg">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span className="text-sm font-medium text-gray-900">Razorpay Mode</span>
              <div className="flex bg-gray-200 rounded-lg p-0.5">
                {['Test', 'Live'].map(m => (
                  <button key={m} onClick={() => setLiveMode(m === 'Live')}
                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${(m === 'Live') === liveMode ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            {[
              { label: `Razorpay Key ID (${liveMode ? 'Live' : 'Test'})`, value: liveMode ? 'rzp_live_••••••••' : 'rzp_test_••••••••' },
              { label: `Razorpay Key Secret (${liveMode ? 'Live' : 'Test'})`, value: '••••••••••••' },
            ].map(({ label, value }) => (
              <div key={label}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <div className="relative">
                  <input type={showRazorpay ? 'text' : 'password'} defaultValue={value}
                    className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none" />
                  <button onClick={() => setShowRazorpay(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showRazorpay ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">CoD Limit (₹)</label>
              <input type="number" defaultValue={5000} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Enabled Payment Methods</label>
              <div className="space-y-2">
                {['UPI', 'Credit/Debit Card', 'Net Banking', 'EMI', 'Cash on Delivery', 'FC Points'].map(m => (
                  <label key={m} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-gray-700">{m}</span>
                  </label>
                ))}
              </div>
            </div>
            <button onClick={() => show('Payment settings saved', 'success')} className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-[#C0001D] rounded-lg hover:bg-red-800">
              <Save size={14} /> Save
            </button>
          </div>
        )

      case 'delivery-partners':
        return (
          <div className="space-y-5 max-w-lg">
            {['Shiprocket', 'Delhivery'].map(partner => (
              <div key={partner} className="p-4 border border-gray-200 rounded-xl space-y-3">
                <h4 className="text-sm font-semibold text-gray-900">{partner}</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">API Key</label>
                    <input type="password" defaultValue="••••••••" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">API Secret</label>
                    <input type="password" defaultValue="••••••••" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none" />
                  </div>
                </div>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Free Delivery Threshold (₹)</label>
                <input type="number" defaultValue={999} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">CoD Fee (₹)</label>
                <input type="number" defaultValue={49} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
              </div>
            </div>
            <button onClick={() => show('Delivery settings saved', 'success')} className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-[#C0001D] rounded-lg hover:bg-red-800">
              <Save size={14} /> Save
            </button>
          </div>
        )

      case 'tax-config':
        return (
          <div className="space-y-4">
            <div className="overflow-x-auto max-w-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">GST Rate (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {taxRates.map((r, i) => (
                    <tr key={r.category}>
                      <td className="px-4 py-3 text-gray-900">{r.category}</td>
                      <td className="px-4 py-3">
                        <input type="number" value={r.gst} onChange={e => setTaxRates(ts => ts.map((t, j) => i === j ? { ...t, gst: +e.target.value } : t))}
                          className="w-20 px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C0001D]/20 focus:border-[#C0001D]" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={() => show('Tax config saved', 'success')} className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-[#C0001D] rounded-lg hover:bg-red-800">
              <Save size={14} /> Save
            </button>
          </div>
        )

      case 'email-templates':
        return (
          <div className="space-y-4 max-w-2xl">
            <div className="flex gap-1 flex-wrap">
              {EMAIL_TEMPLATES.map(t => (
                <button key={t} className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">{t}</button>
              ))}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">HTML Template</label>
              <textarea defaultValue={`<h1>Your order has been confirmed!</h1>\n<p>Hi {{customer_name}},</p>\n<p>Your order {{order_id}} has been confirmed.</p>`}
                rows={10} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none resize-none" />
            </div>
            <button onClick={() => show('Template saved', 'success')} className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-[#C0001D] rounded-lg hover:bg-red-800">
              <Save size={14} /> Save Template
            </button>
          </div>
        )

      case 'sms-push':
        return (
          <div className="space-y-5 max-w-lg">
            <div className="p-4 border border-gray-200 rounded-xl space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">SMS Provider (MSG91 / Twilio)</h4>
              {[{ label: 'API Key', value: '••••••••' }, { label: 'Sender ID', value: 'SSPSTOP' }].map(({ label, value }) => (
                <div key={label}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                  <input defaultValue={value} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                </div>
              ))}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Notification Triggers</h4>
              <div className="space-y-2">
                {['OTP SMS', 'Order Confirmation SMS', 'Shipment SMS', 'Delivery SMS', 'Return Update SMS', 'Push: New Offers', 'Push: Order Updates'].map(t => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-gray-700">{t}</span>
                  </label>
                ))}
              </div>
            </div>
            <button onClick={() => show('SMS & Push settings saved', 'success')} className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-[#C0001D] rounded-lg hover:bg-red-800">
              <Save size={14} /> Save
            </button>
          </div>
        )

      case 'maintenance-mode':
        return (
          <div className="space-y-4 max-w-lg">
            <div className={`p-4 rounded-xl border ${maintenanceMode ? 'border-amber-200 bg-amber-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={18} className={maintenanceMode ? 'text-amber-500' : 'text-gray-400'} />
                  <span className="text-sm font-semibold text-gray-900">Maintenance Mode</span>
                  {maintenanceMode && <span className="text-xs px-2 py-0.5 bg-amber-200 text-amber-800 rounded-full font-medium">ACTIVE</span>}
                </div>
                <button
                  onClick={() => { setMaintenanceMode(m => !m); show(maintenanceMode ? 'Maintenance mode disabled' : 'Maintenance mode enabled — storefront is now offline', maintenanceMode ? 'success' : 'error') }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${maintenanceMode ? 'bg-amber-500' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <p className="text-xs text-gray-500">{maintenanceMode ? 'The storefront is currently offline. Customers see the maintenance message below.' : 'Toggle to take the storefront offline for maintenance.'}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Maintenance Message</label>
              <textarea value={maintenanceMsg} onChange={e => setMaintenanceMsg(e.target.value)} rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none resize-none" />
            </div>
            <button onClick={() => show('Maintenance settings saved', 'success')} className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-[#C0001D] rounded-lg hover:bg-red-800">
              <Save size={14} /> Save
            </button>
          </div>
        )

      case 'feature-flags':
        return (
          <div className="space-y-4 max-w-lg">
            <p className="text-sm text-gray-600">Toggle features on/off without a deployment.</p>
            <div className="space-y-3">
              {featureFlags.map(flag => (
                <div key={flag.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-sm font-medium text-gray-900">{flag.label}</span>
                  <button
                    onClick={() => {
                      setFeatureFlags(fs => fs.map(f => f.key === flag.key ? { ...f, enabled: !f.enabled } : f))
                      show(`${flag.label} ${flag.enabled ? 'disabled' : 'enabled'}`, 'success')
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${flag.enabled ? 'bg-[#C0001D]' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${flag.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )

      default: return null
    }
  }

  const sectionKey = (s: string) => s.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')

  return (
    <div className="flex gap-6">
      {/* Sidebar nav */}
      <aside className="w-48 shrink-0">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {SECTIONS.map(section => (
            <button key={section} onClick={() => setActiveSection(sectionKey(section))}
              className={`w-full text-left px-4 py-3 text-sm border-b border-gray-50 last:border-0 transition-colors ${activeSection === sectionKey(section) ? 'bg-red-50 text-[#C0001D] font-medium border-l-2 border-l-[#C0001D]' : 'text-gray-700 hover:bg-gray-50'}`}>
              {section}
            </button>
          ))}
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-5">
          {SECTIONS.find(s => sectionKey(s) === activeSection) ?? 'Settings'}
        </h3>
        {renderSection()}
      </div>

      <AdminToastContainer toasts={toasts} onDismiss={() => {}} />
    </div>
  )
}
