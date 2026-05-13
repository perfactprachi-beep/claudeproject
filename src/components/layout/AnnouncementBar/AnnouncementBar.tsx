export const AnnouncementBar = () => (
  <div
    role="status"
    aria-label="Promotions"
    className="bg-brand-navy text-white text-xs font-sans text-center py-2.5 px-4 tracking-wide"
  >
    Free Express Delivery on Prepaid Orders above{' '}
    <strong className="font-semibold">₹999</strong>
    &ensp;|&ensp;Use Code:{' '}
    <strong className="text-yellow-300 tracking-widest font-bold">FC10</strong>
    {' '}for{' '}
    <strong className="font-semibold">10% off</strong>
  </div>
)
