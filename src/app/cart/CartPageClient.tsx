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
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            <div className="hidden md:block">
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
            <div className="md:hidden">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center border-b py-4">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="mr-4"
                  />
                  <div className="flex-grow">
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Size: {item.selectedSize}
                    </p>
                    <p className="text-sm">{item.price}</p>
                    <div className="flex items-center mt-2">
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
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">
                      {item.price}
                    </p>
                    <Button
                      className="underline cursor-pointer text-xs"
                      variant="ghost"
                      onClick={() =>
                        removeFromCart(item.id, item.selectedSize)
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full lg:w-1/3">
            <div className="p-4 rounded-none">
             
             
              <div className="flex flex-col gap-2 my-4">
                <p className="text-sm font-semibold">Made-To-Order Only.</p>
                <div className="flex flex-row items-center gap-2">
                  <Image
                    src={"/package.svg"}
                    alt="shipping"
                    width={16}
                    height={16}
                  />
                  <p className="text-sm text-gray-600">
                    Ships in 10 - 14 Days
                  </p>
                </div>
                <p className="text-sm font-semibold text-black border bg-[#293A2826] p-3 rounded-none mb-6 capitalize">
                  Please note that the Place Order button redirects you to
                  WhatsApp so you can discuss with Sheela and also ask
                  necessary questions.
                </p>
              </div>
              <Button
                className="bg-bt-green hover:bg-bt-green/90 rounded-none cursor-pointer px-8 w-full"
                onClick={() => {
                  if (cartItems.length === 0) return;
                  // WhatsApp number from env or fallback
                  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER || "234XXXXXXXXXX";
                  // Format cart items for WhatsApp
                  const itemsText = cartItems
                    .map(
                      (item, idx) =>
                        `${idx + 1}. ${item.name} (Size: ${item.selectedSize || "N/A"}) x${item.quantity} - ₦${item.price} `
                    )
                    .join("\n");
                  const message =
                    `Hello, I would like to place an order:\n\n` +
                    itemsText 



                  const encodedMessage = encodeURIComponent(message);
                  window.open(
                    `https://wa.me/${whatsappNumber}?text=${encodedMessage}`,
                    "_blank"
                  );
                }}
              >
                Place Order
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
