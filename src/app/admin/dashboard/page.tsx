"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { ProductDialog } from '@/components/admin/dashboard/ProductDialog';
import { ProductManagement } from '@/components/admin/dashboard/ProductManagement';
import { DashboardHeader } from '@/components/admin/dashboard/DashboardHeader';
import { CategoryManagement } from '@/components/admin/dashboard/CategoryManagement';
import { FabricManagement } from '@/components/admin/dashboard/FabricManagement';
import { toast } from 'sonner';
import { ProductInventory } from '@/components/admin/dashboard/ProductInventory';

import { ProductWithRelations, FabricSample } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

//#region Types
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
//#endregion

const SheelaAdminDashboard: React.FC = () => {
  //#region User & Auth
  const { user, isSignedIn, isLoaded } = useUser();

  // Check if user is admin
  const isAdmin =
    isSignedIn &&
    isLoaded &&
    (user?.publicMetadata?.role === "admin" ||
      (Array.isArray(user?.publicMetadata?.roles) && user.publicMetadata.roles.includes("admin")));
  //#endregion

  //#region State
  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [fabricSamples, setFabricSamples] = useState<FabricSample[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithRelations | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [stagedProducts, setStagedProducts] = useState<ProductWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Product form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    subCategoryId: '',
    images: [] as ProductImage[],
    sizes: [] as ProductSize[],
    colors: [] as ProductColor[],
    fabricSamples: [] as FabricSample[]
  });
  //#endregion

  //#region Drag & Drop Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  //#endregion

  //#region Data Fetching
  // Fetch categories and subcategories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        setSubCategories(data.flatMap((cat: Category) => cat.subCategories));
      }
    } catch (error) {
      console.error('Failed to fetch categories', error);
      toast.error("Failed to fetch categories. Please refresh the page.");
    }
  }, []);

  // Fetch fabric samples
  const fetchFabricSamples = useCallback(async () => {
    try {
      const response = await fetch('/api/fabrics');
      if (response.ok) {
        setFabricSamples(await response.json());
      }
    } catch (error) {
      console.error('Failed to fetch fabric samples', error);
      toast.error("Failed to fetch fabric samples. Please refresh the page.");
    }
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/product');
      if (response.ok) {
        setProducts(await response.json());
      }
    } catch (error) {
      console.error('Failed to fetch products', error);
      toast.error("Failed to fetch products. Please refresh the page.");
    }
  }, []);
  //#endregion

  //#region Effects
  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { fetchFabricSamples(); }, [fetchFabricSamples]);
  //#endregion

  //#region Product Form Handlers
  // Handle image upload for product
  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newImages: ProductImage[] = [];
    const sizeLimit = 5 * 1024 * 1024; // 5MB

    for (const file of files) {
      if (file.size > sizeLimit) {
        toast.error(`File ${file.name} is too large. The maximum size is 5MB.`);
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
  }, [formData.images.length]);

  // Reset product form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      categoryId: '',
      subCategoryId: '',
      images: [],
      sizes: [],
      colors: [],
      fabricSamples: []
    });
    setSelectedProduct(null);
    setIsEditMode(false);
  };

  // Handle drag end for images (reorder)
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

  // Remove image from product
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

  // Add size to product
  const addSize = (size: string) => {
    if (size.trim() && !formData.sizes.find(s => s.size === size.trim())) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, { id: `size-${Date.now()}`, size: size.trim() }]
      }));
    }
  };

  // Remove size from product
  const removeSize = (id: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s.id !== id)
    }));
  };

  // Add color to product
  const addColor = (color: string) => {
    if (color.trim() && !formData.colors.find(c => c.color === color.trim())) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, { id: `color-${Date.now()}`, color: color.trim() }]
      }));
    }
  };

  // Remove color from product
  const removeColor = (id: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c.id !== id)
    }));
  };
  //#endregion

  //#region Product CRUD
  // Add or update product in staged list or DB
  const addProductToList = async () => {
    setIsLoading(true);
    const productId = isEditMode && selectedProduct ? selectedProduct.id : uuidv4();
    const newProduct: ProductWithRelations = {
      id: productId,
      name: formData.name,
      description: formData.description,
      price: formData.price,
      categoryId: formData.categoryId,
      subCategoryId: formData.subCategoryId,
      images: formData.images.map(image => ({ ...image, productId })),
      sizes: formData.sizes.map(size => ({ ...size, productId })),
      colors: formData.colors.map(color => ({ ...color, productId })),
      fabricSamples: formData.fabricSamples,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as ProductWithRelations;

    if (isEditMode) {
      // Update product in DB
      try {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        if (!cloudName) {
          toast.error("Cloudinary configuration is missing.");
          setIsLoading(false);
          return;
        }

        // Upload new images to Cloudinary
        const uploadedImages = await Promise.all(
          newProduct.images.map(async (image: any) => {
            if (image.file) {
              const formData = new FormData();
              formData.append('file', image.file);
              formData.append('upload_preset', 'sheela-upload'); // Make sure this preset exists

              const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData,
              });

              if (response.ok) {
                const data = await response.json();
                return { ...image, url: data.secure_url, file: undefined };
              } else {
                console.error('Image upload failed:', await response.text());
                toast.error(`Failed to upload image: ${image.file.name}`);
                throw new Error('Image upload failed');
              }
            }
            return image;
          })
        );

        const productToUpdate = { ...newProduct, images: uploadedImages };

        const response = await fetch(`/api/admin/product/${productToUpdate.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productToUpdate),
        });

        if (response.ok) {
          const updatedProduct = await response.json();
          setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
          toast.success("Product updated successfully.");
        } else {
          toast.error("An error occurred while updating the product. Please try again.");
        }
      } catch (error) {
        console.error('Error updating product:', error);
        toast.error("An error occurred while updating the product. Please try again.");
      }
    } else {
      // Add product to staged list
      setStagedProducts(prev => [...prev, newProduct]);
    }
    resetForm();
    setIsAddProductOpen(false);
    setIsLoading(false);
  };

  // Save all staged products to DB
  const saveAllProducts = async () => {
    setIsSaving(true);
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) {
        console.error("Cloudinary cloud name is not set. Please check your environment variables.");
        return;
      }

      for (const stagedProduct of stagedProducts) {
        // Upload images to Cloudinary
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

        // Save product to DB
        const productData = { ...stagedProduct, images: uploadedImages };
        if (productData.subCategoryId === '') {
          productData.subCategoryId = null;
        }
        const response = await fetch('/api/admin/product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });

        if (response.ok) {
          const newProduct = await response.json();
          setProducts(prev => [...prev, newProduct]);
        } else {
          console.error(`Error saving product ${stagedProduct.id}:`, await response.text());
        }
      }

      setStagedProducts([]);
      resetForm();
      setIsAddProductOpen(false);
      // Refresh the products list
      await fetchProducts();
      toast.success("All products have been saved successfully.");
    } catch (error) {
      console.error('Error saving products:', error);
      toast.error("An error occurred while saving products. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Edit product (populate form for editing)
  const editProduct = (product: ProductWithRelations) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      categoryId: product.categoryId,
      subCategoryId: product.subCategoryId || '',
      images: (product.images || []).map(img => ({ ...img, alt: img.alt || undefined })),
      sizes: product.sizes || [],
      colors: product.colors || [],
      fabricSamples: product.fabricSamples || []
    });
    setSelectedProduct(product);
    setIsEditMode(true);
    setIsAddProductOpen(true);
  };

  // Delete product from staged list or DB
  const deleteProduct = async (id: string) => {
    setStagedProducts(prev => prev.filter(p => p.id !== id));
    try {
      const response = await fetch(`/api/admin/product/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error((await response.json()).error || "Failed to delete product");
      setProducts(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (error) {
      console.error("Failed to delete product", error);
      return false;
    }
  };
  //#endregion

  //#region Category & Fabric Management
  // Add category
  const handleAddCategory = async (name: string) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (response.ok) {
        await fetchCategories();
        toast.success(`Category "${name}" has been added successfully.`);
      } else {
        throw new Error((await response.json()).error || 'Failed to add category');
      }
    } catch (error: any) {
      console.error('Error adding category:', error);
      toast.error("Failed to add category. Please try again.");
    }
  };

  // Add subcategory
  const handleAddSubCategory = async (name: string, categoryId: string) => {
    try {
      const response = await fetch('/api/subcategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, categoryId }),
      });
      if (response.ok) {
        await fetchCategories();
        toast.success(`Subcategory "${name}" has been added successfully.`);
      } else {
        throw new Error((await response.json()).error || 'Failed to add subcategory');
      }
    } catch (error: any) {
      console.error('Error adding subcategory:', error);
      toast.error(`Failed to add subcategory. Please try again. ${error.message}`);
    }
  };

  // Delete category
  const handleDeleteCategory = async (id: string): Promise<void> => {
    const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error((await response.json()).error || 'Failed to delete category');
    await fetchCategories();
  };

  // Delete subcategory
  const handleDeleteSubCategory = async (id: string): Promise<void> => {
    const response = await fetch(`/api/subcategories/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error((await response.json()).error || 'Failed to delete subcategory');
    await fetchCategories();
  };

  // Add fabric sample
  const handleAddFabric = async (name: string, image: File) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);

    try {
      const response = await fetch('/api/fabrics', { method: 'POST', body: formData });
      if (response.ok) {
        await fetchFabricSamples();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add fabric sample');
      }
    } catch (error: any) {
      console.error('Error adding fabric sample:', error);
      toast.error(`Failed to add fabric sample: ${error.message}`);
    }
  };

  // Delete fabric sample
  const handleDeleteFabric = async (id: string) => {
    try {
      const response = await fetch(`/api/fabrics/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchFabricSamples();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete fabric sample');
      }
    } catch (error: any) {
      console.error('Error deleting fabric sample:', error);
      toast.error(`Failed to delete fabric sample: ${error.message}`);
    }
  };
  //#endregion

  //#region Render
  if (!isLoaded) {
    return <div>Loading...</div>;
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

  return (
    <div className="min-h-screen bg-gray-50 p-6" suppressHydrationWarning={true}>
      <div className="max-w-9xl mx-auto">
        <DashboardHeader />

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Product Management</TabsTrigger>
            <TabsTrigger value="categories">Category Management</TabsTrigger>
            <TabsTrigger value="fabrics">Fabric Management</TabsTrigger>
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
              isSaving={isSaving}
            >
              <ProductDialog
                isEditMode={isEditMode}
                formData={formData}
                setFormData={setFormData}
                categories={categories}
                subCategories={subCategories}
                fabricSamples={fabricSamples}
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
                isLoading={isLoading}
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

          <TabsContent value="fabrics">
            <FabricManagement
              fabricSamples={fabricSamples}
              onAddFabric={handleAddFabric}
              onDeleteFabric={handleDeleteFabric}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
  //#endregion
};

export default SheelaAdminDashboard;
