
import React from "react";
import { Product } from "@/types/Product";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => (
  <div className="
    grid
    grid-cols-1
    sm:grid-cols-2
    md:grid-cols-3
    lg:grid-cols-4
    gap-8
    py-10
    w-full
    ">
    {products.map((product) => (
      <ProductCard product={product} key={product.id} />
    ))}
  </div>
);

export default ProductGrid;
