"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Product, useStore } from "../../stores/useStore";
import { toast } from "sonner";

interface AddToCartDialogProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const AddToCartDialog: React.FC<AddToCartDialogProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { addToCart } = useStore();
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : ""
  );
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : ""
  );
  const [selectedLength, setSelectedLength] = useState("medium");

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, 1, selectedLength);
    toast.success(`${product.name} has been added to your cart.`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Options for {product.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="text-lg font-medium">Size</h3>
              <div className="flex gap-2 mt-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    className="cursor-pointer"
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <div>
            <h3 className="text-lg font-medium">Length</h3>
            <div className="flex gap-2 mt-2">
              <Button
                className="cursor-pointer"
                variant={selectedLength === "medium" ? "default" : "outline"}
                onClick={() => setSelectedLength("medium")}
              >
                Medium
              </Button>
              <Button
                className="cursor-pointer"
                variant={selectedLength === "regular" ? "default" : "outline"}
                onClick={() => setSelectedLength("regular")}
              >
                Regular
              </Button>
              <Button
                className="cursor-pointer"
                variant={selectedLength === "tall" ? "default" : "outline"}
                onClick={() => setSelectedLength("tall")}
              >
                Tall
              </Button>
            </div>
          </div>
          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="text-lg font-medium">Color</h3>
              <div className="flex items-center space-x-2 mt-2">
                {product.colors.map((color, index) => (
                  <button
                    key={`${product.id}-${color}-${index}`}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 cursor-pointer ${
                      selectedColor === color
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button className="cursor-pointer bg-bt-green" onClick={handleAddToCart}>Add to Cart</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddToCartDialog;
