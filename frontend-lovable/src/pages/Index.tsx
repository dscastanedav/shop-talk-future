
import React, { useState } from "react";
import ProductGrid from "@/components/ProductGrid";
import FloatingAdvisorButton from "@/components/FloatingAdvisorButton";
import SearchAndFilters from "@/components/SearchAndFilters";
import { Product } from "@/types/Product";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

function useProducts(searchTerm: string, selectedBrand: string, sortOrder: string) {
  return useQuery({
    queryKey: ["products", searchTerm, selectedBrand, sortOrder],
    queryFn: async () => {
      let query = supabase.from("products").select("*");
      
      // Apply search filter
      if (searchTerm) {
        query = query.ilike("name", `%${searchTerm}%`);
      }
      
      // Apply brand filter
      if (selectedBrand && selectedBrand !== "all") {
        query = query.eq("brand", selectedBrand);
      }
      
      // Apply sorting
      if (sortOrder === "price-asc") {
        query = query.order("price", { ascending: true });
      } else if (sortOrder === "price-desc") {
        query = query.order("price", { ascending: false });
      } else {
        query = query.order("name", { ascending: true });
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

const Index: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [sortOrder, setSortOrder] = useState("name");

  const { data: products, isLoading, error } = useProducts(searchTerm, selectedBrand, sortOrder);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-[#f2f6ff] font-sans relative">
      <header className="pt-10 pb-6 px-4 max-w-5xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3 tracking-tight">
          Marketplace Futurista
        </h1>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto">
          Encuentra productos seleccionados para el futuro: tecnología, diseño y bienestar. <span className="inline-block animate-pulse">🚀</span>
        </p>
      </header>

      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedBrand={selectedBrand}
        onBrandChange={setSelectedBrand}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        products={products || []}
      />

      <section className="max-w-6xl mx-auto px-4">
        {isLoading && (
          <div className="text-center text-muted-foreground py-12">
            Cargando productos...
          </div>
        )}
        {error && (
          <div className="text-center text-destructive py-12">
            Ocurrió un error al cargar los productos.
          </div>
        )}
        {!isLoading && !error && products && (
          <ProductGrid products={products} />
        )}
      </section>
      <FloatingAdvisorButton />
      <footer className="text-center text-xs text-muted-foreground py-6 opacity-80">
        <span>© 2025 Shop Talk Future &middot; Hecho con IA</span>
      </footer>
    </main>
  );
};

export default Index;
