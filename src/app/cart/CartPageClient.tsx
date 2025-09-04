"use client";

import { useStore } from "../../../stores/useStore";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";

export default function CartPageClient() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useStore();

  return (
    <div className="container mx-auto px-4 py-8 mt-10">
      <h1 className="text-3xl font-normal mb-6 text-center uppercase tracking-wider">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="flex items-center">
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="mr-4"
                      />
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Size: {item.selectedSize}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity - 1,
                              item.selectedSize
                            )
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="mx-4">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity + 1,
                              item.selectedSize
                            )
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>
                      <Button
                      className="underline cursor-pointer"
                        variant="ghost"
                        onClick={() =>
                          removeFromCart(item.id, item.selectedSize)
                        }
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Shipping info */}
         <div className="flex flex-col  lg:col-start-2 lg:col-span-1 gap-2 my-4">
             <p className="text-sm font-semibold mb-2">Made-To-Order Only.</p>
                  <div className="flex flex-row items-center gap-2">
                    <Image src={"/package.svg"} alt="shipping" width={16} height={16}/>  
                    <p className="text-sm text-gray-600 ">Ships in 10 - 14 Days</p>
                  </div>
                  
                  <p className="text-sm font-semibold text-black border bg-[#293A2826] p-3 rounded-none mb-6 capitalize">
                    Please note that the Place Order button redirects you to WhatsApp so you can 
                    discuss with Sheela and also ask necessary questions.
                  </p>
          
                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    
                    <Button className="bg-bt-green hover:bg-bt-green/90 rounded-none cursor-pointer px-8 w-full">Place Order</Button>
                  </div>
                
         </div>

        </div>
        
      )}
    </div>
  );
}
