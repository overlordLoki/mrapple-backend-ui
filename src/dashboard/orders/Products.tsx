// src/components/Products.tsx

import { Product } from './Types';

interface ProductsProps {
    products: Product[];
}

const Products = ({ products }: ProductsProps) => {
    // Map product names to image filenames for easy reference
    const productImages: Record<string, string> = {
        'Ava': '/ava.png',
        'Dazzle': '/dazzle.png',
        'Braeburn': '/braeburn.png',
        'Granny Smith': '/granny.png',
        'NZ Prince': '/prince.png',
        'Royal Gala': '/gala.png',
    };

    return (
        <div className="bg-white bg-opacity-50 p-6 mt-6 rounded-lg shadow-lg border border-gray-300">
            <h2 className="text-2xl font-semibold mb-4 text-center">Our Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((product) => {
                    const imageSrc = productImages[product.product_name];

                    return (
                        <div key={product.product_id} className="text-center p-4 border rounded-lg shadow-md">
                            <span className="text-4xl">
                                {imageSrc ? (
                                    <img 
                                        src={imageSrc}  // Dynamically load the image for the product
                                        alt={product.product_name} 
                                        className="w-16 h-16 mx-auto" 
                                    />
                                ) : (
                                    <p>Image not found</p>
                                )}
                            </span>
                            <h3 className="text-lg font-semibold mt-2">{product.product_name}</h3>
                            <p className="text-sm text-gray-600">{product.description}</p>
                            <p className="mt-2 text-xl font-semibold">${product.price}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Products;
