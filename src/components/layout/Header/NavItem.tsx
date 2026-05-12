interface NavItemProps {
  label: string
  href: string
}

export const NavItem = ({ label, href }: NavItemProps) => (
  <a
    href={href}
    className="relative text-gray-700 hover:text-brand-red text-sm font-medium font-sans transition-colors duration-200 py-1 group whitespace-nowrap"
  >
    {label}
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-red transition-all duration-200 group-hover:w-full" />
  </a>
)
