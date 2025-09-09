import React from "react";
import prisma from "@/lib/prisma";
import SearchPageClient from "./SearchPageClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


interface SearchPageProps {
  searchParams: {
    q: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const query = searchParams.q || "";
  const products = await prisma.product.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
    include: {
      images: true,
      category: true,
    },
  });

  return (
  <div className="flex flex-col overflow-x-hidden justify-center items-center px-0">
    <Header/>
    <div>
        <SearchPageClient products={products} query={query} />
    </div>
    <Footer/>
  </div>)

};

export default SearchPage;
