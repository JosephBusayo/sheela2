"use client";

import React, { useState, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


import { ProductDialog } from '@/components/admin/dashboard/ProductDialog';
import { ProductManagement } from '@/components/admin/dashboard/ProductManagement';
import { DashboardHeader } from '@/components/admin/dashboard/DashboardHeader';
import { CategoryManagement } from '@/components/admin/dashboard/CategoryManagement';
import { toast } from 'sonner';
import { ProductInventory } from '@/components/admin/dashboard/ProductInventory';
import { Product } from '@prisma/client';
import { ProductWithRelations } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

// Types
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
  subCategories: SubCategory[];
}

interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
}

const SheelaAdminDashboard: React.FC = () => {
  const { user, isSignedIn, isLoaded } = useUser();


  // Admin role check
  const isAdmin =
    isSignedIn &&
    isLoaded &&
    (user?.publicMetadata?.role === "admin" ||
      (Array.isArray(user?.publicMetadata?.roles) && user.publicMetadata.roles.includes("admin")));

  if (!isLoaded) {
    return <div>...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
          <p>You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithRelations | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [stagedProducts, setStagedProducts] = useState<any[]>([]);

 
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    subCategoryId: '',
    images: [] as ProductImage[],
    sizes: [] as ProductSize[],
    colors: [] as ProductColor[]
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      categoryId: '',
      subCategoryId: '',
      images: [],
      sizes: [],
      colors: []
    });
    setSelectedProduct(null);
    setIsEditMode(false);
  };

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        const allSubCategories = data.flatMap((cat: Category) => cat.subCategories);
        setSubCategories(allSubCategories);
      }
    } catch (error) {
      console.error('Failed to fetch categories', error);
      toast.error(
       
        "Failed to fetch categories. Please refresh the page."
        
      );
    }
  }, [toast]);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch('/api/products/main');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products', error);
      toast.error(
        "Failed to fetch products. Please refresh the page."
      );
    }
  }, []);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle image upload
  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newImages: ProductImage[] = [];
    const sizeLimit = 5 * 1024 * 1024; // 5MB

    for (const file of files) {
      if (file.size > sizeLimit) {
        toast.error(
          `File ${file.name} is too large. The maximum size is 5MB.`,
          
        );
        continue;
      }
      newImages.push({
        id: `temp-${Date.now()}-${newImages.length}`,
        url: URL.createObjectURL(file),
        alt: '',
        order: formData.images.length + newImages.length,
        file
      });
    }
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  }, [formData.images.length, toast]);

  // Handle drag end for images
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setFormData(prev => {
        const oldIndex = prev.images.findIndex(item => item.id === active.id);
        const newIndex = prev.images.findIndex(item => item.id === over.id);
        const newImages = arrayMove(prev.images, oldIndex, newIndex);
        return {
          ...prev,
          images: newImages.map((img, index) => ({ ...img, order: index }))
        };
      });
    }
  };

  // Remove image
  const removeImage = (id: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== id)
    }));
  };

  // Update image alt text
  const updateImageAlt = (id: string, alt: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map(img => 
        img.id === id ? { ...img, alt } : img
      )
    }));
  };

  // Add size
  const addSize = (size: string) => {
    if (size.trim() && !formData.sizes.find(s => s.size === size.trim())) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, { id: `size-${Date.now()}`, size: size.trim() }]
      }));
    }
  };

  // Add color
  const addColor = (color: string) => {
    if (color.trim() && !formData.colors.find(c => c.color === color.trim())) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, { id: `color-${Date.now()}`, color: color.trim() }]
      }));
    }
  };

  // Remove size
  const removeSize = (id: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s.id !== id)
    }));
  };

  // Remove color
  const removeColor = (id: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c.id !== id)
    }));
  };

  const addProductToList = () => {
    const productId = isEditMode ? selectedProduct!.id : uuidv4();
    const newProduct = {
      id: productId,
      name: formData.name,
      description: formData.description,
      price: formData.price,
      categoryId: formData.categoryId,
      subCategoryId: formData.subCategoryId,
      images: formData.images.map(image => ({ ...image, productId })),
      sizes: formData.sizes.map(size => ({ ...size, productId })),
      colors: formData.colors.map(color => ({ ...color, productId })),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as ProductWithRelations;

    if (isEditMode) {
      setProducts(prev => prev.map(p => p.id === newProduct.id ? newProduct : p));
    } else {
      setStagedProducts(prev => [...prev, newProduct]);
    }
    resetForm();
    setIsAddProductOpen(false);
  };

  // Save all products
const saveAllProducts = async () => {
    
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) {
        console.error("Cloudinary cloud name is not set. Please check your environment variables.");
       
        return;
      }
      for (const stagedProduct of stagedProducts) {
        const uploadedImages = await Promise.all(
          stagedProduct.images.map(async (image: any) => {
            if (image.file) {
              const formData = new FormData();
              formData.append('file', image.file);
              formData.append('upload_preset', 'sheela-upload');

              const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData,
              });

              if (response.ok) {
                const data = await response.json();
                return { ...image, url: data.secure_url, file: undefined };
              } else {
                throw new Error('Image upload failed');
              }
            }
            return image;
          })
        );

        const productData = {
          ...stagedProduct,
          images: uploadedImages,
        };

        const response = await fetch('/api/products/main', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });

        if (response.ok) {
          const savedProduct = await response.json();
          setProducts(prev => [...prev, savedProduct]);
        } else {
          const errorText = await response.text();
          console.error(`Error saving product ${stagedProduct.id}:`, errorText);
          
        }
      }

      setStagedProducts([]);
      resetForm();
      setIsAddProductOpen(false);
      toast.success(
        "All products have been saved successfully.",
      );
    } catch (error) {
      console.error('Error saving products:', error);
      toast(
       "An error occurred while saving products. Please try again."
       
      );
    } finally {
   
    }
  };

  // Edit product
  const editProduct = (product: ProductWithRelations) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      categoryId: product.categoryId,
      subCategoryId: product.subCategoryId || '',
      images: product.images.map(img => ({ ...img, alt: img.alt || undefined })),
      sizes: product.sizes,
      colors: product.colors
    });
    setSelectedProduct(product);
    setIsEditMode(true);
    setIsAddProductOpen(true);
  };

  // Delete product
  const deleteProduct = async (id: string) => {
    // Remove from staged products (not yet saved to DB)
    setStagedProducts(prev => prev.filter(p => p.id !== id));

    // Remove from DB and local state
    try {
      const response = await fetch(`/api/admin/product/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete product");
      }

      setProducts(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (error) {
      console.error("Failed to delete product", error);
      return false;
    }
  };

  // Category Management Functions
  const handleAddCategory = async (name: string) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        await fetchCategories();
        toast.success(
           `Category "${name}" has been added successfully.`,
        );
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add category');
      }
    } catch (error: any) {
      console.error('Error adding category:', error);
      toast.error(
        
       "Failed to add category. Please try again.",
        
      );
    }
  };

  const handleAddSubCategory = async (name: string, categoryId: string) => {
    try {
      const response = await fetch('/api/subcategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, categoryId }),
      });

      if (response.ok) {
        await fetchCategories();
        toast.success(
          `Subcategory "${name}" has been added successfully.`,
        );
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add subcategory');
      }
    } catch (error: any) {
      console.error('Error adding subcategory:', error);
      toast.error(
        
   `Failed to add subcategory. Please try again. ${error.message}`,
        
      );
    }
  };

  const handleDeleteCategory = async (id: string): Promise<void> => {
    const response = await fetch(`/api/categories/${id}`, { 
      method: 'DELETE' 
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete category');
    }

    // Refresh categories after successful deletion
    await fetchCategories();
  };

  const handleDeleteSubCategory = async (id: string): Promise<void> => {
    const response = await fetch(`/api/subcategories/${id}`, { 
      method: 'DELETE' 
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete subcategory');
    }

    // Refresh categories after successful deletion
    await fetchCategories();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6" suppressHydrationWarning={true}>
      <div className="max-w-9xl mx-auto">
        <DashboardHeader />

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Product Management</TabsTrigger>
            <TabsTrigger value="categories">Category Management</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <ProductInventory />
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <ProductManagement
              products={products}
              categories={categories}
              subCategories={subCategories}
              resetForm={resetForm}
              setIsAddProductOpen={setIsAddProductOpen}
              editProduct={editProduct}
              deleteProduct={deleteProduct}
              isAddProductOpen={isAddProductOpen}
              stagedProducts={stagedProducts}
              saveAllProducts={saveAllProducts}
            >
              <ProductDialog
                isEditMode={isEditMode}
                formData={formData}
                setFormData={setFormData}
                categories={categories}
                subCategories={subCategories}
                handleImageUpload={handleImageUpload}
                handleDragEnd={handleDragEnd}
                removeImage={removeImage}
                updateImageAlt={updateImageAlt}
                addSize={addSize}
                removeSize={removeSize}
                addColor={addColor}
                removeColor={removeColor}
                onConfirm={addProductToList}
                sensors={sensors}
              />
            </ProductManagement>
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManagement
              categories={categories}
              onAddCategory={handleAddCategory}
              onAddSubCategory={handleAddSubCategory}
              onDeleteCategory={handleDeleteCategory}
              onDeleteSubCategory={handleDeleteSubCategory}
            />
          </TabsContent>
        </Tabs>
      </div>
      
     
    </div>
  );
};

export default SheelaAdminDashboard;
