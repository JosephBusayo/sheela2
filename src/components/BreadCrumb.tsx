import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";



interface BreadCrumbProps {
    title: string;
    }

const BreadCrumb = ({title}: BreadCrumbProps) => {
  return (
    <div className="mb-0 py-4 flex flex-row">
      <div className="">
        <div className="flex flex-row row">
          <div className="flex flex-row">
            <p className="flex items-center text-center mb-0">
              <Link href="/" className="text-white">
                HOME
              </Link>
              <ChevronRight className="w-5 h-5 mx-1" />
              {title}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreadCrumb;
