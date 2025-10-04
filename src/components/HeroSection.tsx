"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
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

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  useAuth,
  useUser,
} from "@clerk/nextjs";
import { useStore } from "../../stores/useStore";
import {
  ChevronDown,
  Heart,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";

export default function Hero() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const router = useRouter();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      router.push(`/store/search?q=${searchQuery}`);
      setIsSearchOpen(false);
    }
  };

  const {
    cartCount,
    favoritesCount,
    setAuthState,
    migrateLocalData,
    cartItems,
    favorites,
  } = useStore();

  const navItems: NavItem[] = [
    { label: "Women", hasDropdown: true, link: "/store/women" },
    { label: "Men", hasDropdown: true, link: "/store/men" },
  ];

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  //clerk auth
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();

  const backgroundImages = [
    {
      left: "/images/model1.png",
      right: "/images/model2.png",
    },
    {
      left: "/images/model2.png",
      right: "/images/model1.png",
    },
  ];

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden flex flex-col mb-2">
      {/* Header */}
      <div className="absolute top-0 inset-x-0 z-50 w-full flex flex-row text-white justify-between">
        <div className="mx-auto px-1 md:px-4 lg:px-8 justify-between text-white w-full">
          <div className="flex items-center justify-between h-12 md:h-16 lg:h-20">
            {/* Left Navigation */}
            <nav className="hidden md:flex items-center md:space-x-6 lg:space-x-8">
              {navItems.map((item) => (
                <div key={item.label} className="relative">
                  <Link href={`/store/${item.label.toLowerCase()}`}>
                    <button
                      className="flex items-center space-x-1 text-white text-shadow-lg hover:transition-colors font-normal  tracking-wider duration-200 cursor-pointer"
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
                <div className="relative w-18 h-16 md:w-32 md:h-24">
                  <Image
                    src="/images/sheela-white.png"
                    alt="Sheela Logo"
                    fill
                    className="cursor-pointer object-contain md:backdrop-blur-xs"
                  />
                </div>
              </Link>
            </div>

            {/* Right Actions */}
            <div
              className="flex items-center space-x-0 md:space-x-4"
              suppressHydrationWarning={true}
            >
              {/* Search */}
              {isSearchOpen ? (
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="border rounded-md py-1 sm:px-2 md:px-2 w-24 h-6 md:h-8 md:w-32 transition-all duration-300 ease-in-out placeholder:text-xs placeholder:pl-1"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    autoFocus
                  />
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-2 text-gray-100 hover:text-white"
                  >
                    <X className="w-4 h-4 cursor-pointer" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-gray-100 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  <Search className="w-4 h-4 cursor-pointer md:w-5 md:h-5 lg:w-6 lg:h-6" />
                </button>
              )}

              {/* Shopping Cart with Badge */}
              <Link href="/cart">
                <button className="relative p-2 text-gray-100 hover:text-white transition-colors duration-200 cursor-pointer">
                  <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 cursor-pointer" />

                  {cartCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gray-800 text-white text-xs rounded-lg w-6 h-5 flex items-center justify-center cursor-pointer">
                      {cartCount() > 99 ? "99+" : cartCount()}
                    </span>
                  )}
                </button>
              </Link>

              {/* Wishlist/Favorites with Badge */}
              <Link href="/wishlist">
                <button className="relative p-2 text-gray-100 hover:text-white transition-colors duration-200 cursor-pointer">
                  <Heart
                    className="w-4 h-4 md:w-5 md:h-5 
                  lg:w-6 lg:h-6 cursor-pointer"
                  />
                  {favoritesCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#FF0000] text-white text-xs rounded-lg w-6 h-5 flex items-center justify-center cursor-pointer">
                      {favoritesCount() > 99 ? "99+" : favoritesCount()}
                    </span>
                  )}
                </button>
              </Link>

              {/* User Account */}
              {mounted ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative rounded-full">
                      {isSignedIn && user ? (
                        <Image
                          src={user.imageUrl}
                          alt="User profile"
                          width={32}
                          height={32}
                          className="rounded-full w-6 ml-1 h-6 md:w-8 md:h-8 cursor-pointer"
                        />
                      ) : (
                        <div className="p-2 text-gray-100 hover:text-white transition-colors duration-200 cursor-pointer">
                          <User className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 cursor-pointer" />
                        </div>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-5">
                    {isSignedIn ? (
                      <>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/profile"
                            className="cursor-pointer w-full"
                          >
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
              ) : (
                <button className="relative rounded-full">
                  {isSignedIn && user ? (
                    <Image
                      src={user.imageUrl}
                      alt="User profile"
                      width={32}
                      height={32}
                      className="rounded-full w-6 ml-1 h-6 md:w-8 md:h-8 cursor-pointer"
                    />
                  ) : (
                    <div className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer">
                      <User className="w-5 h-5 cursor-pointer" />
                    </div>
                  )}
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-100 hover:text-white cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <svg
                  className="w-4 h-4"
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
          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden  absolute top-10 left-0 w-full shadow-md z-50 bg-green-900/50">
              <nav className="px-2 py-2 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.link}
                    className="block px-2 py-1 text-gray-100 hover:text-white rounded-md text-sm tracking-widest font-light"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
        
      </div>
      

      <Image
        src="/images/newHero.png"
        alt="Background"
        fill
        className="object-cover object-center z-0 lg:object-[center_40%]"
        priority
      />

      {/* Overlay Text + Button */}
      <div
        className="
          absolute inset-0 flex flex-col items-center justify-center text-center z-40
          w-full 
          left-1/2 -translate-x-1/2
          px-4 sm:px-8 bg-black/50 
         
        "
      >
<h1 className="relative text-white text-center text-xl md:text-4xl lg:text-6xl font-light leading-[140%] uppercase text-shadow-lg flex flex-col justify-center items-center max-w-2xl lg:max-w-4xl">
          inspired by africa, made for the world
        </h1>
        <Link href={"/store/women"}>
          <Button className="h-8 md:h-12 bg-bt-green px-2 md:px-6 py-2 mt-6 cursor-pointer border-0 rounded-none shadow-sm">
            <span className="font-normal sm:font-light md:tracking-wide text-white text-xs md:text-sm uppercase">
              explore the collection
            </span>
          </Button>
        </Link>
      </div>
    </section>
  );
}
