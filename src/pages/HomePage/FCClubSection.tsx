const tiers = [
  {
    id: 'classic',
    name: 'Classic',
    minSpend: '₹0',
    maxSpend: '₹9,999',
    earnRate: '1 pt / ₹100',
    gradFrom: '#9CA3AF',
    gradTo: '#6B7280',
    textGold: false,
  },
  {
    id: 'silver',
    name: 'Silver Edge',
    minSpend: '₹10,000',
    maxSpend: '₹24,999',
    earnRate: '2 pts / ₹100',
    gradFrom: '#93C5FD',
    gradTo: '#3B82F6',
    textGold: false,
  },
  {
    id: 'platinum',
    name: 'Platinum',
    minSpend: '₹25,000',
    maxSpend: '₹74,999',
    earnRate: '3 pts / ₹100',
    gradFrom: '#E5E7EB',
    gradTo: '#C0C0C0',
    textGold: false,
  },
  {
    id: 'black',
    name: 'Black',
    minSpend: '₹75,000',
    maxSpend: '+',
    earnRate: '5 pts / ₹100',
    gradFrom: '#1A1A2E',
    gradTo: '#000000',
    textGold: true,
  },
]

export const FCClubSection = () => (
  <section
    aria-labelledby="fc-club-heading"
    className="py-14 md:py-20"
    style={{ background: 'linear-gradient(160deg, #1A1A2E 0%, #0D0D1A 100%)' }}
  >
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 xl:px-16">

      {/* Header */}
      <div className="text-center mb-10 md:mb-12">
        <p className="text-[11px] font-semibold font-sans uppercase tracking-[0.3em] text-[#D4AF37] mb-3">
          Loyalty Programme
        </p>
        <h2
          id="fc-club-heading"
          className="font-serif text-3xl md:text-5xl font-bold text-white mb-3"
        >
          First Citizen Club
        </h2>
        <p className="text-gray-400 font-sans text-base max-w-lg mx-auto leading-relaxed">
          India's most rewarding loyalty programme. Earn points every time you shop and unlock
          exclusive benefits at every tier.
        </p>
      </div>

      {/* Tier cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className="rounded-xl overflow-hidden p-5 flex flex-col gap-3 border border-white/10"
            style={{ background: `linear-gradient(135deg, ${tier.gradFrom}, ${tier.gradTo})` }}
          >
            <p
              className={
                tier.textGold
                  ? 'text-[#D4AF37] text-xs font-semibold font-sans uppercase tracking-widest'
                  : 'text-white/70 text-xs font-semibold font-sans uppercase tracking-widest'
              }
            >
              Tier
            </p>
            <p
              className={
                tier.textGold
                  ? 'font-serif text-xl font-bold text-[#D4AF37]'
                  : 'font-serif text-xl font-bold text-white'
              }
            >
              {tier.name}
            </p>
            <div className="mt-auto">
              <p className="text-[11px] font-sans text-white/60 uppercase tracking-wider mb-1">
                Annual Spend
              </p>
              <p className="text-sm font-semibold font-sans text-white">
                {tier.minSpend}
                {tier.maxSpend !== '+' ? ` – ${tier.maxSpend}` : '+'}
              </p>
              <p className="text-xs font-sans text-white/70 mt-2">{tier.earnRate}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats + CTA */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/10 pt-8">
        <div className="flex gap-8 md:gap-14 flex-wrap justify-center">
          {[
            { value: '10M+', label: 'Members' },
            { value: '100+', label: 'Partner Brands' },
            { value: '91+',  label: 'Stores' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="font-serif text-2xl md:text-3xl font-bold text-white">{value}</p>
              <p className="text-[11px] text-gray-400 font-sans uppercase tracking-wider mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <a
            href="/first-citizen/join"
            className="inline-flex items-center justify-center h-11 px-6 bg-white text-brand-navy rounded font-semibold font-sans text-sm tracking-wide hover:bg-gray-100 transition-colors"
          >
            Become a Member
          </a>
          <a
            href="/first-citizen"
            className="inline-flex items-center justify-center h-11 px-6 border border-white/30 text-white rounded font-semibold font-sans text-sm tracking-wide hover:bg-white/10 hover:border-white/60 transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>

    </div>
  </section>
)
