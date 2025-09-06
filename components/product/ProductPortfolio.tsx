

import React from 'react';
import Header from '../common/Header';
import { Product } from '../../types';
// FIX: Correct import of `useAppContext` which is now properly exported from `AppContext.tsx`.
import { useAppContext } from '../../context/AppContext';

interface ProductPortfolioProps {
    onViewProduct: (productId: string) => void;
}

const ProductCard: React.FC<{ product: Product, onClick: () => void }> = ({ product, onClick }) => (
    <div 
        onClick={onClick}
        className="p-4 rounded-lg border border-vasco-dark-border bg-vasco-dark-card cursor-pointer hover:border-vasco-primary hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
    >
        <h4 className="font-semibold text-vasco-text-primary text-lg">{product.name}</h4>
        <p className="text-sm text-vasco-text-secondary">Owner: {product.owner}</p>
        {product.category === 'Software' && 'features' in product ? (
             <p className="text-xs text-vasco-text-secondary mt-2">{product.features.length} features</p>
        ) : null}
    </div>
);

const ProductGroup: React.FC<{ title: string, products: Product[], onViewProduct: (id: string) => void }> = ({ title, products, onViewProduct }) => {
    if (products.length === 0) return null;
    return (
        <div>
            <h3 className="text-lg font-medium text-vasco-text-secondary mb-3 border-b border-vasco-dark-border pb-2">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(p => <ProductCard key={p.id} product={p} onClick={() => onViewProduct(p.id)} />)}
            </div>
        </div>
    )
};

const ProductPortfolio: React.FC<ProductPortfolioProps> = ({ onViewProduct }) => {
    const { products } = useAppContext();
    
    const hardwareSubCategories = ['Handhelds', 'Wearables'];
    const softwareSubCategories = ['Translator Apps', 'Mobile Apps', 'Desktop', 'Internal Products'];

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <Header title="Product Portfolio" subtitle="Manage all hardware, software, and internal products." />
            <div className="p-8 space-y-12">
                <section>
                    <div className="flex justify-between items-center mb-6">
                         <h2 className="text-3xl font-bold text-vasco-text-primary">Hardware</h2>
                         <button className="px-4 py-2 text-sm rounded-md bg-vasco-primary text-white hover:bg-vasco-primary-hover">Add Product</button>
                    </div>
                    <div className="space-y-8">
                        {hardwareSubCategories.map(subCategory => (
                            <ProductGroup 
                                key={subCategory}
                                title={subCategory}
                                products={products.filter(p => p.category === 'Hardware' && p.subCategory === subCategory)}
                                onViewProduct={onViewProduct}
                            />
                        ))}
                    </div>
                </section>
                
                <section>
                    <h2 className="text-3xl font-bold text-vasco-text-primary mb-6">Software</h2>
                    <div className="space-y-8">
                        {softwareSubCategories.map(subCategory => (
                            <ProductGroup 
                                key={subCategory}
                                title={subCategory}
                                products={products.filter(p => p.category === 'Software' && p.subCategory === subCategory)}
                                onViewProduct={onViewProduct}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProductPortfolio;