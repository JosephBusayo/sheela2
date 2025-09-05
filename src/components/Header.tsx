"use client";

import React, { useState } from "react";
import { Search, ShoppingCart, Heart, User, ChevronDown, X } from "lucide-react";
import Image from "next/image";
import { useStore } from "../../stores/useStore";
import {
  useAuth,
  useUser,
  SignInButton,
  SignUpButton,
  SignOutButton,
} from "@clerk/nextjs";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItem {
  label: string;
  hasDropdown?: boolean;
  link: string;
}

const Header: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Get cart and favorites count from Zustand store
  const {
    cartCount,
    favoritesCount,
    setAuthState,
    migrateLocalData,
    cartItems,
    favorites,
  } = useStore();

  const navItems: NavItem[] = [
    { label: "Women", hasDropdown: true, link:"/store/women" },
    { label: "Men", hasDropdown: true, link:"/store/men" },
    { label: "Kids", hasDropdown: true, link:"/store/kids" },
    { label: "Unisex", hasDropdown: true, link:"/store/unisex" },
  ];

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  //clerk auth
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();

  return (
    <header className="w-full bg-white shadow-sm justify-between py-4">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 justify-between">
        <div className="flex items-center justify-between h-16">
          {/* Left Navigation */}
          <nav className="hidden md:flex items-center md:space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                <Link href={`/store/${item.label.toLowerCase()}`}>
                  <button
                    className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 cursor-pointer"
                    onClick={() =>
                      item.hasDropdown && toggleDropdown(item.label)
                    }
                  >
                    <span className="cursor-pointer">{item.label}</span>

                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        activeDropdown === item.label ? "rotate-180" : ""
                      } cursor-pointer`}
                    />
                  </button>
                </Link>
              </div>
            ))}
          </nav>

          {/* Logo */}
          <div className="flex-1 md:flex-none md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
            <Link href={"/"}>
              <div className="relative w-36 h-36">
                <Image
                  src="/images/sheela-logo.png"
                  alt="Sheela Logo"
                  layout="fill"
                  objectFit="contain"
                  className="cursor-pointer"
                />
              </div>
            </Link>
          </div>

          {/* Right Actions */}
          <div
            className="flex items-center space-x-4"
            suppressHydrationWarning={true}
          >
            {/* Search */}
            {isSearchOpen ? (
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  className="border rounded-md py-1 px-2 w-32 transition-all duration-300 ease-in-out"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-2 text-gray-500 hover:text-gray-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
              >
                <Search className="w-5 h-5 cursor-pointer" />
              </button>
            )}

            {/* Shopping Cart with Badge */}
            <Link href="/cart">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer">
                <Image
                  src={"/bag-2.svg"}
                  alt="cart"
                  className="w-6 h-6 cursor-pointer"
                  width={6}
                  height={6}
                />

                {cartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gray-800 text-white text-xs rounded-lg w-6 h-5 flex items-center justify-center cursor-pointer">
                    {cartCount() > 99 ? "99+" : cartCount()}
                  </span>
                )}
              </button>
            </Link>

            {/* Wishlist/Favorites with Badge */}
            <Link href="/wishlist">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer">
                <Heart className="w-6 h-5 cursor-pointer" />
                {favoritesCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF0000] text-white text-xs rounded-lg w-6 h-5 flex items-center justify-center cursor-pointer">
                    {favoritesCount() > 99 ? "99+" : favoritesCount()}
                  </span>
                )}
              </button>
            </Link>

            {/* User Account */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative rounded-full">
                  {isSignedIn && user ? (
                    <Image
                      src={user.imageUrl}
                      alt="User profile"
                      width={32}
                      height={32}
                      className="rounded-full w-8 h-8"
                    />
                  ) : (
                    <div className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer">
                      <User className="w-5 h-5 cursor-pointer" />
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-5">
                {isSignedIn ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer w-full">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <SignOutButton>
                        <button className="w-full text-left cursor-pointer">
                          Sign Out
                        </button>
                      </SignOutButton>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild className="w-auto">
                      <SignInButton mode="modal">
                        <button className="w-full text-left cursor-pointer">
                          Sign In
                        </button>
                      </SignInButton>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <SignUpButton mode="modal">
                        <button className="w-full text-left cursor-pointer">
                          Sign Up
                        </button>
                      </SignUpButton>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <nav className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.link}
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      
      
     
    </header>
  );
};

export default Header;
