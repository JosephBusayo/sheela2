"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { ProductWithRelations } from '@/lib/types';

// Types from parent component
interface Category {
  id: string;
  name: string;
}

interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
}

interface ProductManagementProps {
  products: ProductWithRelations[];
  categories: Category[];
  subCategories: SubCategory[];
  resetForm: () => void;
  setIsAddProductOpen: (isOpen: boolean) => void;
  editProduct: (product: ProductWithRelations) => void;
  deleteProduct: (id: string) => void;
  children: React.ReactNode;
  isAddProductOpen: boolean;
  stagedProducts: ProductWithRelations[];
  saveAllProducts: () => void;
}

export const ProductManagement: React.FC<ProductManagementProps> = ({
  products,
  categories,
  subCategories,
  resetForm,
  setIsAddProductOpen,
  editProduct,
  deleteProduct,
  children,
  isAddProductOpen,
  stagedProducts,
  saveAllProducts,
}) => {
  return (
    <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className='mb-2'>Product Management</CardTitle>
              <CardDescription>
                Manage your store's products, including details, pricing, and images.
              </CardDescription>
            </div>
            <div className='flex items-center gap-x-4'>
              <Button onClick={saveAllProducts} disabled={stagedProducts.length === 0} className='cursor-pointer bg-green-600 hover:bg-green-700'>
                Save All Products ({stagedProducts.length})
              </Button>
              <Button 
                  onClick={() => {
                    resetForm();
                    setIsAddProductOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.length === 0 && stagedProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No products found. Add your first product to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[...products, ...stagedProducts].map(product => {
                  const category = categories.find(c => c.id === product.categoryId);
                  const subCategory = subCategories.find(s => s.id === product.subCategoryId);
                  
                  return (
                    <Card key={product.id} className="overflow-hidden bg-white border-gray-200">
                      <div className="aspect-square relative w-full h-[300px] sm:h-[200px] md:h-[400px] cursor-pointer">
                        <img
                          src={product.images[0]?.url || '/api/placeholder/300/300'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0"
                            onClick={() => editProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 w-8 p-0"
                            onClick={() => deleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                        <p className="text-2xl font-bold text-green-600 mb-2">{product.price}</p>
                        <div className="flex gap-2 mb-2">
                          <Badge variant="outline">{category?.name}</Badge>
                          {subCategory && (
                            <Badge variant="secondary">{subCategory.name}</Badge>
                          )}
                        </div>
                        {product.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {product.description}
                          </p>
                        )}
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>{product.images.length} images</span>
                          <span>{product.sizes.length} sizes</span>
                          <span>{product.colors.length} colors</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
        {children}
      </Card>
    </Dialog>
  );
};
