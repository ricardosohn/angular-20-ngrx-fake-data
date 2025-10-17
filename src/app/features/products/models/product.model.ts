export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

export type CreateProductDto = Omit<Product, 'id' | 'rating'>;
export type UpdateProductDto = Partial<CreateProductDto>;
