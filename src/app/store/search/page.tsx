import React from "react";
import prisma from "@/lib/prisma";
import SearchPageClient from "./SearchPageClient";


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

  return <SearchPageClient products={products} query={query} />;
};

export default SearchPage;
