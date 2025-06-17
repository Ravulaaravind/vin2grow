// Mock data for products
export const mockProducts = [
  {
    _id: '1',
    name: 'Mango pickle',
    description: 'Traditional mango pickle with authentic spices',
    price: 199,
    length: 10,
    width: 8,
    height: 12,
    category: 'Veg pickles',
    image: '/images/categories/veg-pickles/mango-pickle.jpg',
    stock: 50,
    discount: 10,
    rating: 4.5,
    reviews: 120,
    tags: ['spicy', 'traditional', 'homemade'],
    isNewLaunch: true,
    createdAt: '2024-03-15'
  },
  {
    _id: '2',
    name: 'Lemon pickle',
    description: 'Tangy lemon pickle with special spices',
    price: 179,
    length: 10,
    width: 8,
    height: 12,
    category: 'Veg pickles',
    image: '/images/categories/veg-pickles/lemon-pickle.jpg',
    stock: 45,
    discount: 5,
    rating: 4.3,
    reviews: 98,
    tags: ['tangy', 'traditional', 'homemade'],
    isNewLaunch: false,
    createdAt: '2024-03-10'
  },
  {
    _id: '3',
    name: 'Chicken pickle',
    description: 'Spicy chicken pickle with authentic taste',
    price: 299,
    length: 10,
    width: 8,
    height: 12,
    category: 'Non-veg pickles',
    image: '/images/categories/non-veg-pickles/chicken-pickle.jpg',
    stock: 30,
    discount: 15,
    rating: 4.7,
    reviews: 85,
    tags: ['spicy', 'non-veg', 'homemade'],
    isNewLaunch: true,
    createdAt: '2024-03-12'
  },
  {
    _id: '4',
    name: 'Sanchi Stupa',
    description: 'Handcrafted model of the Sanchi Stupa, made from wood. Perfect for decor and gifting.',
    price: 1500,
    length: 20,
    width: 20,
    height: 15,
    category: 'Handicrafts',
    images: [
      '/uploads/sanchi1.jpg',
      '/uploads/sanchi2.jpg',
      '/uploads/sanchi3.jpg',
      '/uploads/sanchi4.jpg'
    ],
    stock: 10,
    discount: 0,
    rating: 4.9,
    reviews: 12,
    tags: ['handicraft', 'wood', 'decor', 'gift'],
    isNewLaunch: true,
    createdAt: '2024-06-01'
  }
];

// Export mock data
export default mockProducts;