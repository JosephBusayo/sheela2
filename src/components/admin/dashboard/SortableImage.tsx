"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GripVertical, X } from 'lucide-react';

// Types
interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  order: number;
  file?: File;
}

export const SortableImage: React.FC<{ 
  image: ProductImage; 
  onRemove: (id: string) => void;
  onUpdateAlt: (id: string, alt: string) => void;
}> = ({ image, onRemove, onUpdateAlt }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group border-2 border-dashed border-gray-200 rounded-lg p-2 bg-gray-50"
    >
      <div className="absolute top-1 left-1 z-10">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing bg-white rounded p-1 shadow-sm"
        >
          <GripVertical className="h-4 w-4 text-gray-500" />
        </div>
      </div>
      <div className="absolute top-1 right-1 z-10">
        <Button
          size="sm"
          variant="destructive"
          className="h-6 w-6 p-0"
          onClick={() => onRemove(image.id)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      <img
        src={image.url}
        alt={image.alt || 'Product image'}
        className="w-full h-32 object-cover rounded"
      />
      <Input
        placeholder="Alt text"
        value={image.alt || ''}
        onChange={(e) => onUpdateAlt(image.id, e.target.value)}
        className="mt-2 text-xs"
      />
    </div>
  );
};
