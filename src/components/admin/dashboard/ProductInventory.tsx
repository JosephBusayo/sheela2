"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import { format } from "date-fns";

interface ProductWithRelations extends Product {
  images: { url: string }[];
  sizes: { size: string }[];
}

export function ProductInventory() {
  const [products, setProducts] = useState<ProductWithRelations[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products/main');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    }

    fetchProducts();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Inventory</CardTitle>
        <CardDescription>View and manage all your products in one place.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead className="hidden md:table-cell">Sizes</TableHead>
              <TableHead>Images</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{product.name}</span>
                    <span className="text-sm text-muted-foreground line-clamp-2">{product.description}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell"><span className="">₦</span>{product.price}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-1">
                    {product.sizes.map((size, index) => (
                      <Badge key={index} variant="outline">{size.size}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {product.images.length > 0 && (
                      <Image
                        alt="Product image"
                        className="aspect-square rounded-md object-cover"
                        height="40"
                        src={product.images[0].url}
                        width="40"
                      />
                    )}
                    <span>{product.images.length} <span className="hidden lg:inline">Image(s)</span></span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell pl-5 lg:pl-0">{format(new Date(product.createdAt), "MMM d, yyyy")}</TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
