"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Globe, ShoppingCart, MessageSquare, Users, ClipboardCheck, DollarSign, HourglassIcon, Shirt } from 'lucide-react';
import Image from 'next/image';
import { UserButton, UserProfile } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

interface DashboardStats {
  numListings: number;
  itemsInCart: number;
  websiteVisits: number;
  completedOrders: number;
  pendingOrders: number;
  monthlySales: number;
}

export const DashboardHeader: React.FC = () => {
    const { user, isSignedIn } = useUser();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchStats = async () => {
        try {
          const response = await fetch('/api/stats');
          const data = await response.json();
          setStats(data);
        } catch (error) {
          console.error('Failed to fetch stats:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchStats();
    }, []);

    const statsCards = [
        {
          title: "Number of listings",
          value: stats?.numListings ?? "...",
          Icon: Shirt,
          color: "text-bt-green",
        },
       
        {
          title: "Items in cart for all users",
          value: stats?.itemsInCart ?? "...",
          Icon: ShoppingCart,
          color: "text-orange-600",
        },
        {
          title: "Number of completed orders",
          value: stats?.completedOrders ?? "...",
          Icon: ClipboardCheck,
          color: "text-purple-600",
        },
        {
           title: "Number of pending orders",
          value: stats?.pendingOrders ?? "...",
          Icon: HourglassIcon,
          color: "text-purple-600",
        },
        {
           title: "Sales made this month",
          value: stats?.monthlySales ? `$${stats.monthlySales.toFixed(2)}` : "...",
          Icon: DollarSign,
          color: "text-purple-600",
        }

      ];

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-12 border-b border-gray-200">
        
        <div className="relative h-16 w-16 md:h-24 md:w-24">
          <Link href={"/"}  >
          <Image src={"/images/sheela-logo.png"} alt='logo' fill className='object-cover'/>
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-3">
        {isSignedIn && (
            <>
              <UserButton/>
              <span>{user?.fullName}</span>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
            <Card key={index}>
                <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-lg text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{loading ? '...' : stat.value}</p>
                    </div>
                    <stat.Icon className={`h-8 w-8 text-green-600`} />
                </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
};
