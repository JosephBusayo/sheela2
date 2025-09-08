"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Globe, ShoppingCart, MessageSquare, Users } from 'lucide-react';
import Image from 'next/image';
import { UserProfile } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
export const DashboardHeader: React.FC = () => {
    const { user, isSignedIn } = useUser();

    const stats = [
        {
          title: "Number of listings",
          value: "34",
          Icon: Package,
          color: "text-bt-green",
        },
        {
          title: "Number of website visits",
          value: "57",
          Icon: Globe,
          color: "text-green-600",
        },
        {
          title: "Items in cart for all users",
          value: "42",
          Icon: ShoppingCart,
          color: "text-orange-600",
        },
        {
          title: "Number of whatsapp messages",
          value: "63",
          Icon: MessageSquare,
          color: "text-purple-600",
        },
      ];

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-12 border-b border-gray-200">
        
        <div className="relative h-16 w-16 md:h-24 md:w-24">
          <Image src={"/images/sheela-logo.png"} alt='logo' fill className='object-cover'/>
        </div>
        <div className="ml-auto flex items-center gap-3">
        {isSignedIn && (
            <>
              <UserProfile />
              <span>{user?.fullName}</span>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
            <Card key={index}>
                <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-lg text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <stat.Icon className={`h-8 w-8 text-`} />
                </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
};
