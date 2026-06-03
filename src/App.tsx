import { useState } from 'react';
import type { Section } from './types';
import Sidebar from './components/layout/Sidebar';
import MainContent from './components/layout/MainContent';

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('overview');

  return (
    <div className="flex w-full h-screen bg-gray-50 overflow-hidden">
      <Sidebar active={activeSection} onNavigate={setActiveSection} />
      <MainContent active={activeSection} />
    </div>
  );
}
