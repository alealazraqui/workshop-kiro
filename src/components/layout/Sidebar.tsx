import type { Section } from '../../types';

interface SidebarProps {
  active: Section;
  onNavigate: (section: Section) => void;
}

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'overview', label: 'Resumen de Ventas' },
];

export default function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-56 min-h-screen bg-white shadow-sm border-r border-gray-100">
      {/* Logo / Brand */}
      <div className="px-5 py-5 border-b border-gray-100">
        <span className="text-lg font-bold text-indigo-600 tracking-tight">
          Ecommerce
        </span>
        <span className="block text-xs text-gray-400 mt-0.5">Dashboard</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
          Reportes
        </p>
        {SECTIONS.map(({ id, label }) => {
          const isActive = id === active;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={[
                'flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              ].join(' ')}
              aria-current={isActive ? 'page' : undefined}
            >
              <svg
                className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-indigo-400'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="18" height="7" rx="1" />
              </svg>
              {label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">© 2024 Workshop Kiro</p>
      </div>
    </aside>
  );
}
