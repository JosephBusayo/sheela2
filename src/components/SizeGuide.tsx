"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const sizeData = [
  { bodyPart: "Chest", xs: "34-36", s: "36-38", m: "38-40", l: "40-42", xl: "42-44", xxl: "44-46" },
  { bodyPart: "Shoulder", xs: "16.5", s: "17.5", m: "18.5", l: "19.5", xl: "20.5", xxl: "21.5" },
  { bodyPart: "Sleeve lenght", xs: "32-33", s: "33-34", m: "34-35", l: "35-36", xl: "36-37", xxl: "37-38" },
  { bodyPart: "Back lenght", xs: "27", s: "28", m: "29", l: "30", xl: "31", xxl: "32" },
  { bodyPart: "waist", xs: "28-30", s: "30-32", m: "32-34", l: "34-36", xl: "36-38", xxl: "38-40" },
];

const SizeGuide = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="text-xs underline text-gray-600 cursor-pointer">
         See Size Guide
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>SIZE GUIDE (INCHES)</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">BODY PART</TableHead>
              <TableHead className="text-center">XS</TableHead>
              <TableHead className="text-center">S</TableHead>
              <TableHead className="text-center">M</TableHead>
              <TableHead className="text-center">L</TableHead>
              <TableHead className="text-center">XL</TableHead>
              <TableHead className="text-center">XXL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sizeData.map((row) => (
              <TableRow key={row.bodyPart}>
                <TableCell className="font-medium capitalize">{row.bodyPart}</TableCell>
                <TableCell className="text-center">{row.xs}</TableCell>
                <TableCell className="text-center">{row.s}</TableCell>
                <TableCell className="text-center">{row.m}</TableCell>
                <TableCell className="text-center">{row.l}</TableCell>
                <TableCell className="text-center">{row.xl}</TableCell>
                <TableCell className="text-center">{row.xxl}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default SizeGuide;
