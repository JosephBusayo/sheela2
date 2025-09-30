"use client";

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FabricSample {
  id: string;
  name: string;
  image: string;
}

interface FabricSamplesDialogProps {
  fabricSamples: FabricSample[];
}

export const FabricSamplesDialog: React.FC<FabricSamplesDialogProps> = ({
  fabricSamples,
}) => {
  return (
    <Accordion type="single" collapsible className="w-full mb-4">
      <AccordionItem value="item-1">
        <AccordionTrigger className='cursor-pointer text-sm'>See Fabric Samples</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {fabricSamples.map((sample) => (
              <div key={sample.id} className="text-center">
                <img
                  src={sample.image}
                  alt={sample.name}
                  className="w-full h-24 object-cover rounded-lg shadow-md"
                />
                <p className="text-sm mt-2">{sample.name}</p>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
