"use client";

import React from 'react';
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableImage } from './SortableImage';
import { ImageIcon, Plus, Save, X } from 'lucide-react';

// Types from parent component
interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  order: number;
  file?: File;
}

interface ProductSize {
  id: string;
  size: string;
}

interface ProductColor {
  id: string;
  color: string;
}

interface Category {
  id: string;
  name: string;
}

interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
}

interface FabricSample {
  id: string;
  name: string;
  image: string;
}

interface FormData {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  subCategoryId: string;
  images: ProductImage[];
  sizes: ProductSize[];
  colors: ProductColor[];
  fabricSamples: FabricSample[];
}

interface ProductDialogProps {
  isEditMode: boolean;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  categories: Category[];
  subCategories: SubCategory[];
  fabricSamples: FabricSample[];
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragEnd: (event: any) => void;
  removeImage: (id: string) => void;
  updateImageAlt: (id: string, alt: string) => void;
  addSize: (size: string) => void;
  removeSize: (id: string) => void;
  addColor: (color: string) => void;
  removeColor: (id: string) => void;
  onConfirm: () => void;
  sensors: any;
  isLoading: boolean;
}

export const ProductDialog: React.FC<ProductDialogProps> = ({
  isEditMode,
  formData,
  setFormData,
  categories,
  subCategories,
  fabricSamples,
  handleImageUpload,
  handleDragEnd,
  removeImage,
  updateImageAlt,
  addSize,
  removeSize,
  addColor,
  removeColor,
  onConfirm,
  sensors,
  isLoading,
}) => {
  const filteredSubCategories = subCategories.filter(sub => sub.categoryId === formData.categoryId);

  return (
    <DialogContent className="max-w-4xl max-h-[80vh] md:max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogDescription>
            Create a new product listing for your store.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-4">
            <div className=''>
              <Label htmlFor="productName" className='mb-2'>Product Name *</Label>
              <Input
                id="productName"
                placeholder="Enter Product Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="description" className='mb-2'>Description</Label>
              <Textarea
                id="description"
                placeholder="Enter Product Description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="price" className='mb-2'>Price *</Label>
              <Input
                id="price"
                placeholder="Enter Price (e.g. 100)"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className=''>
                <Label htmlFor="category" className='mb-2'>Category *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    categoryId: value,
                    subCategoryId: '' // Reset subcategory
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subCategory" className='mb-2'>Sub Category</Label>
                <Select
                  value={formData.subCategoryId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, subCategoryId: value }))}
                  disabled={!formData.categoryId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sub Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSubCategories.map(subCategory => (
                      <SelectItem key={subCategory.id} value={subCategory.id}>
                        {subCategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <Label className='mb-2'>Sizes</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add size (e.g., XS, S, M, L)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSize((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder*="Add size"]') as HTMLInputElement;
                    if (input?.value) {
                      addSize(input.value);
                      input.value = '';
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.sizes.map(size => (
                  <Badge key={size.id} variant="secondary" className="flex items-center gap-1">
                    {size.size}
                    <span className="ml-1 cursor-pointer" onClick={() => removeSize(size.id)}>
                      <X className="h-3 w-3" />
                    </span>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <Label className='mb-2'>Colors</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add color (e.g., Black, White, Red)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addColor((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder*="Add color"]') as HTMLInputElement;
                    if (input?.value) {
                      addColor(input.value);
                      input.value = '';
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.colors.map(color => (
                  <Badge key={color.id} variant="secondary" className="flex items-center gap-1">
                    {color.color}
                    <span className="ml-1 cursor-pointer" onClick={() => removeColor(color.id)}>
                      <X className="h-3 w-3" />
                    </span>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Fabric Samples */}
            <div>
              <Label className='mb-2'>Fabric Samples</Label>
              <Select
                onValueChange={(value) => {
                  const sample = fabricSamples.find(s => s.id === value);
                  if (sample && !formData.fabricSamples.find(s => s.id === value)) {
                    setFormData(prev => ({
                      ...prev,
                      fabricSamples: [...prev.fabricSamples, sample]
                    }));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Fabric Sample" />
                </SelectTrigger>
                <SelectContent>
                  {fabricSamples.map(sample => (
                    <SelectItem key={sample.id} value={sample.id}>
                      <div className="flex items-center gap-2">
                        <img src={sample.image} alt={sample.name} className="h-8 w-8 object-cover rounded" />
                        <span>{sample.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.fabricSamples.map(sample => (
                  <div key={sample.id} className="relative">
                    <img src={sample.image} alt={sample.name} className="h-16 w-16 object-cover rounded" />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 cursor-pointer"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          fabricSamples: prev.fabricSamples.filter(s => s.id !== sample.id)
                        }));
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <p className="text-xs text-center mt-1">{sample.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/*  Images */}
          <div>
            <Label className='mb-2'>Product Images</Label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
              <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Click To Upload Images Or Drag And Drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, JPEG up to 5MB each
                </p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            {formData.images.length > 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={formData.images.map(img => img.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="grid grid-cols-2 gap-4">
                    {formData.images.map(image => (
                      <SortableImage
                        key={image.id}
                        image={image}
                        onRemove={removeImage}
                        onUpdateAlt={updateImageAlt}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={onConfirm}
            className="bg-green-600 hover:bg-green-700"
            disabled={!formData.name || !formData.price || !formData.categoryId || isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            {isEditMode ? 'Update Product' : 'Add Product to List'}
          </Button>
        </DialogFooter>
      </DialogContent>
  );
};
