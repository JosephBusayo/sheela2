"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { UserProfile } from "@clerk/nextjs";
import React from "react";

function Profile() {
  return (
    <div>
      <Header/>
    <div className="my-6 w-full flex justify-center items-center">

      <UserProfile  />
    </div>
    <Footer/>
    </div>
  );
}

export default Profile;
