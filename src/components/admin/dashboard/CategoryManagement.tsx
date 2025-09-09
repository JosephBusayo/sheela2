"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import {toast} from "sonner"

interface SubCategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  subCategories: SubCategory[];
}

interface CategoryManagementProps {
  categories: Category[];
  onAddCategory: (name: string) => void;
  onAddSubCategory: (name: string, categoryId: string) => void;
  onDeleteCategory: (id: string) => Promise<void>;
  onDeleteSubCategory: (id: string) => Promise<void>;
}

export const CategoryManagement: React.FC<CategoryManagementProps> = ({
  categories,
  onAddCategory,
  onAddSubCategory,
  onDeleteCategory,
  onDeleteSubCategory,
}) => {
  const [newCategory, setNewCategory] = useState('');
  const [newSubCategory, setNewSubCategory] = useState<{ [key: string]: string }>({});
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
  
  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    setDeletingCategory(categoryId);
    try {
      await onDeleteCategory(categoryId);
      toast.success(`Category "${categoryName}" has been deleted.`);
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast.error(error.message || "Failed to delete category. Please try again.");
    } finally {
      setDeletingCategory(null);
    }
  };

  const handleDeleteSubCategory = async (subCategoryId: string, subCategoryName: string) => {
    try {
      await onDeleteSubCategory(subCategoryId);
      toast.success(`Subcategory "${subCategoryName}" has been deleted.`);
    } catch (error: any) {
      console.error('Error deleting subcategory:', error);
      toast.error(error.message || "Failed to delete subcategory. Please try again.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Management</CardTitle>
        <CardDescription>Manage your store categories and subcategories.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="New Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <Button
            onClick={() => { onAddCategory(newCategory); setNewCategory(''); }}
            disabled={!newCategory.trim()}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Category
          </Button>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {categories.map(category => (
            <AccordionItem key={category.id} value={category.id}>
              <AccordionTrigger>
                <div className="flex justify-between items-center w-full">
                  <span>{category.name}</span>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => e.stopPropagation()}
                        disabled={deletingCategory === category.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the category "{category.name}"? 
                          This action cannot be undone. If this category has products or subcategories, 
                          the deletion will fail to prevent data loss.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteCategory(category.id, category.name)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-4">
                  {category.subCategories.map(sub => (
                    <div key={sub.id} className="flex justify-between items-center mb-2">
                      <span>{sub.name}</span>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Subcategory</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the subcategory "{sub.name}"? 
                              This action cannot be undone. If this subcategory has products, 
                              the deletion will fail to prevent data loss.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteSubCategory(sub.id, sub.name)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="New Subcategory"
                      value={newSubCategory[category.id] || ''}
                      onChange={(e) => setNewSubCategory(prev => ({ ...prev, [category.id]: e.target.value }))}
                    />
                    <Button
                      onClick={() => { onAddSubCategory(newSubCategory[category.id], category.id); setNewSubCategory(prev => ({ ...prev, [category.id]: '' })); }}
                      disabled={!newSubCategory[category.id] || !newSubCategory[category.id].trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};
