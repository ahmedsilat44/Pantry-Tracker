'use client'

import { Inter } from "next/font/google";
import { firestore } from "@/firebase";
import { useEffect, useState } from "react";


const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{margin:0}} className={inter.className}>{children}</body>
    </html>
  );
}
