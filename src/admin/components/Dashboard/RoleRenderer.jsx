import React from 'react';
import { SectionType } from '../types/role';

interface RoleRendererProps {
  visibleSections: SectionType[];
  children: React.ReactNode;
  sectionId: SectionType;
}

const RoleRenderer: React.FC<RoleRendererProps> = ({ visibleSections, children, sectionId }) => {
  if (!visibleSections.includes(sectionId)) {
    return null;
  }

  return (
    <div className="animate-in fade-in duration-500">
      {children}
    </div>
  );
};

export default RoleRenderer;
