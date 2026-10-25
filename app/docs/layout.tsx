import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import DocSidebar from "@/components/doc-sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 py-6 lg:flex-row lg:gap-8">
          <DocSidebar />

          {/* Article and TOC centre together in the remaining width once the article hits its measure cap. */}
          <div className="flex min-w-0 flex-1 justify-center gap-8">
            {children}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
