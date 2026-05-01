/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ComponentProps } from '../../types';
import BlockRenderer from '../Render/BlockRenderer';
import { GripVertical } from 'lucide-react';

interface CanvasProps {
  components: ComponentProps[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function Canvas({ components, selectedId, onSelect }: CanvasProps) {
  if (components.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-neutral-400">
        <p className="text-sm font-medium">Empty Page</p>
        <p className="text-xs mt-1">Add components from the sidebar to start building</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <SortableContext items={components.map(c => c.id)} strategy={verticalListSortingStrategy}>
        {components.map((comp) => (
          <SortableItem 
            key={comp.id} 
            component={comp} 
            isSelected={selectedId === comp.id}
            onSelect={() => onSelect(comp.id)}
          />
        ))}
      </SortableContext>
    </div>
  );
}

function SortableItem({ component, isSelected, onSelect }: { component: ComponentProps, isSelected: boolean, onSelect: () => void, key?: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`group relative ${isSelected ? 'ring-2 ring-blue-500 z-10' : 'hover:ring-1 hover:ring-blue-300'}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Drag Handle */}
      <div 
        {...attributes} 
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 border border-neutral-200 rounded cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-sm"
      >
        <GripVertical className="w-4 h-4 text-neutral-400" />
      </div>

      <div className="pointer-events-none select-none">
        <BlockRenderer component={component} />
      </div>
    </div>
  );
}
