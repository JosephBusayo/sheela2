"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { ProductWithRelations } from "@/lib/types";

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
  isSaving: boolean;
}

export const ProductManagement: React.FC<ProductManagementProps> = ({
  products = [],
  categories,
  subCategories,
  resetForm,
  setIsAddProductOpen,
  editProduct,
  deleteProduct,
  children,
  isAddProductOpen,
  stagedProducts = [],
  saveAllProducts,
  isSaving,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductWithRelations | null>(null);

  const handleDeleteClick = (product: ProductWithRelations) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };
  return (
    <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="mb-2">Product Management</CardTitle>
              <CardDescription>
                Manage your store's products, including details, pricing, and
                images.
              </CardDescription>
            </div>
            <div className="flex items-center gap-x-4">
              <Button
                onClick={saveAllProducts}
                disabled={stagedProducts.length === 0 || isSaving}
                className="cursor-pointer bg-green-600 hover:bg-green-700"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  `Save All Products (${stagedProducts.length})`
                )}
              </Button>
              <Button
                onClick={() => {
                  resetForm();
                  setIsAddProductOpen(true);
                }}
                className="cursor-pointer bg-bt-green hover:bg-green-900"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(!Array.isArray(products) || products.length === 0) && (!Array.isArray(stagedProducts) || stagedProducts.length === 0) ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">
                  No products found. Add your first product to get started.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {[
                  ...(Array.isArray(products) ? products : []),
                  ...(Array.isArray(stagedProducts) ? stagedProducts : []),
                ].map((product) => {
                  const category = categories.find(
                    (c) => c.id === product.categoryId
                  );
                  const subCategory = subCategories.find(
                    (s) => s.id === product.subCategoryId
                  );

                  return (
                    <Card
                      key={product.id || `${product.name}-${Math.random()}`}
                      className="overflow-hidden bg-white border-gray-200 p-0"
                    >
                      <div className="relative w-full h-[200px] md:h-[300px] cursor-pointer">
                        <img
                          src={
                            Array.isArray(product.images) && product.images.length > 0
                              ? product.images[0].url
                              : "/api/placeholder/300/300"
                          }
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0 cursor-pointer"
                            onClick={() => editProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 w-8 p-0 cursor-pointer"
                            onClick={() => handleDeleteClick(product)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">
                          {product.name}
                        </h3>
                        <p className="text-2xl font-bold text-green-600 mb-2">
                          ${product.price}
                        </p>
                        <div className="flex gap-2 mb-2">
                          <Badge variant="outline">{category?.name}</Badge>
                          {subCategory && (
                            <Badge variant="secondary">
                              {subCategory.name}
                            </Badge>
                          )}
                        </div>
                        {product.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {product.description}
                          </p>
                        )}
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>{product.images?.length || 0} images</span>
                          <span>{product.sizes?.length || 0} sizes</span>
                          <span>{product.colors?.length || 0} colors</span>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};
