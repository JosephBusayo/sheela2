import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';

const stylesData = [
  {
    imageUrl: '/style1.png',
    title: 'STYLES FOR MEN',
    link: '/store/men',
  },
  {
    imageUrl: '/style2.png',
    title: 'STYLES FOR WOMEN',
    link: '/store/women',
  },
];


const StyleGrid = () => {
  return (
<section className="mt-16 lg:mt-0 w-full flex justify-center px-2 md:px-4 lg:px-8 lg:bg-gray-100 lg:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-30 w-full lg:w-[75%] ">
        {stylesData.map((style) => (
          <div
            key={style.title}
            className="relative w-full h-[350px] md:h-[650px] lg:h-[700px] group overflow-hidden"
          >
          <Image
            src={style.imageUrl}
            alt={style.title}
            width={400}
            height={400}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out">
            <h3 className="text-white text-[12px] md:text-2xl lg:text-3xl font-light tracking-wider">{style.title}</h3>
            <Link href={style.link} className="mt-2">
              <Button
                variant="outline"
                className="text-white bg-bt-green text-[8px] py-1 md:py-4 lg:py-6 lg:px-6 px-1 md:px-6 md:text-sm cursor-pointer border-0 rounded-none font-light tracking-widest md:font-light"
              >
                View Collection
              </Button>
            </Link>
          </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StyleGrid;
