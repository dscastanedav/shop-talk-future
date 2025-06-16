
import React from "react";
import { Product } from "@/types/Product";

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-2xl duration-200 border border-border min-h-[400px]">
      <div className="aspect-w-1 aspect-h-1 bg-gray-50 flex items-center justify-center overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="object-cover w-full h-56"
          loading="lazy"
        />
      </div>
      <div className="flex-1 flex flex-col p-5">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold text-foreground truncate flex-1 mr-2">{product.name}</h2>
          <span className="text-sm text-muted-foreground bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
            {product.brand}
          </span>
        </div>
        <p className="text-sm text-muted-foreground flex-1 mb-4">{product.description}</p>
        <div className="mt-auto">
          <span className="text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
