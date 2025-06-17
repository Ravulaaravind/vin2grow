import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import { products as productsApi } from '../services/api';
import { mockProducts } from '../data/mockProducts';

const BACKEND_URL = 'https://vin2grow-frontend-x3tw.onrender.com/';

// Helper function to get image URL
const getImageUrl = (img) => {
  if (!img) return '/placeholder.svg';
  if (img.startsWith('http')) return img;
  const cleanImgPath = img.startsWith('/') ? img : `/${img}`;
  return BACKEND_URL + cleanImgPath.replace(/^\/+/, '');
};

// Image Modal Component
const ImageModal = ({ isOpen, onClose, product, quantities, handleQuantityChange, handleAddToCart }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  
  React.useEffect(() => {
    setSelectedImage(0);
  }, [isOpen, product]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4" onClick={onClose}>
      <div 
        className="relative bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-green-700"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-gray-300 transition-colors z-50 bg-gray-700 rounded-full p-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="overflow-y-auto flex-1">
          <div className="md:flex">
            {/* Images Section */}
            <div className="md:w-1/2 p-4">
              {/* Main Image */}
              <div className="relative w-full h-64 bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                <img
                  src={product?.images?.[selectedImage] ? getImageUrl(product.images[selectedImage]) : '/placeholder.svg'}
                  alt={product?.name}
                  className="w-full h-full object-contain"
                />
                {product?.discount > 0 && (
                  <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {product.discount}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {(product?.images || []).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border ${selectedImage === index ? 'border-green-500 ring-2 ring-green-400' : 'border-gray-600'}`}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`${product?.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details Section */}
            <div className="md:w-1/2 p-4 border-t md:border-t-0 md:border-l border-gray-700">
              <h2 className="text-xl font-bold text-white mb-2">{product?.name}</h2>
              
              {product?.discount > 0 && (
                <span className="inline-block bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full mb-2">
                  Limited time deal
                </span>
              )}

              <p className="text-sm text-gray-300 mb-3">{product?.description}</p>
              
              {/* Product Tags */}
              {product?.tags && product.tags.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Tags:</h4>
                  <div className="flex flex-wrap gap-1">
                    {product.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Product Dimensions */}
              {product.length && product.width && product.height ? (
                <div className="mb-1">
                  <p className="text-xs text-gray-400">
                    <span className="text-gray-300 font-semibold">Dimensions:</span> {product.length} × {product.width} × {product.height} cm
                  </p>
                </div>
              ) : null}
              
              {/* Stock Information */}
              {product.stock !== undefined ? (
                <div className="mb-1">
                  <p className="text-xs text-gray-400">
                    <span className="text-gray-300 font-semibold">Stock:</span> {product.stock} available
                  </p>
                </div>
              ) : null}
              
              {/* Price Section */}
              <div className="mb-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-white">₹{product?.price}</span>
                  {product?.discount > 0 && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{Math.round(product?.price * (1 + product?.discount / 100))}
                    </span>
                  )}
                </div>
              </div>

              {/* Product Rating and Reviews */}
              {product?.rating && product?.reviews !== undefined && (
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400 mr-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-600'}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.729c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">({product.reviews} reviews)</span>
                </div>
              )}

              {/* Quantity Controls */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">Quantity</label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-gray-600 rounded-md overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange(product?._id, -1)}
                      className="px-2 py-1 bg-gray-700 hover:bg-gray-600 active:bg-green-600 transition-colors text-gray-300 active:text-white text-sm"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-center min-w-[30px] text-sm text-white">
                      {quantities[product?._id] || 1}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(product?._id, 1)}
                      className="px-2 py-1 bg-gray-700 hover:bg-gray-600 active:bg-green-600 transition-colors text-gray-300 active:text-white text-sm"
                    >
                      +
                    </button>
                  </div>
                  {/* Add to Cart Button */}
                  <button
                    onClick={() => {
                      handleAddToCart(product);
                      onClose();
                    }}
                    className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Products = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddedToCartMessage, setShowAddedToCartMessage] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const allTags = [...new Set(products.flatMap(product => product.tags))];

  // Static price range values
  const priceSteps = [0, 500, 1000, 2000, 5000, 10000];

  const filteredProducts = products
    .filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(product => product.price >= priceRange[0] && product.price <= priceRange[1])
    .filter(product => selectedTags.length === 0 || selectedTags.some(tag => product.tags.includes(tag)))
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b._id - a._id;
        default:
          return b.reviews - a.reviews;
      }
    });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productsApi.getAll();
        // Add the Furley House product
        const productsWithFurley = [
          ...response.data,
          {
            _id: 'Warli-house',
            name: 'Warli House',
            description: 'Made with bamboo and crafting bamboo strips',
            price: 4999,
            discount: 25,
            length: 29,
            width: 29,
            height: 33,
            stock: 10,
            rating: 4.5,
            reviews: 15,
            tags: ['bamboo', 'house', 'decor'],
            images: ['https://res.cloudinary.com/dnbqgzh4t/image/upload/v1749717841/cwuak5ryngud40gtpe1c.jpg']
          }
        ];
        setProducts(productsWithFurley);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, value) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + value)
    }));
  };

  const handleAddToCart = async (product) => {
    try {
      const quantity = quantities[product._id] || 1;
      await addToCart({
        ...product,
        quantity
      });
      setShowAddedToCartMessage(true);
      setTimeout(() => {
        setShowAddedToCartMessage(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {showAddedToCartMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-700 text-white px-4 py-2 rounded-md shadow-lg z-50 text-sm font-medium">
          Added to Cart Successfully
        </div>
      )}

      {/* Fixed Header with Search and Filters */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-gray-800 shadow-md border-b border-green-700 pt-[4.5rem]">
        <div className="max-w-screen-xl mx-auto">
          {/* Search Bar */}
          <div className="px-4 py-3">
            <div className="relative flex items-center">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search wooden treasures..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 text-sm rounded-lg border border-green-700 bg-gray-700 text-white placeholder-green-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-400 hover:text-green-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="md:hidden flex justify-center pb-3 px-4">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Mobile Filters - Shown when toggled */}
          {showMobileFilters && (
            <div className="md:hidden bg-gray-800 px-4 py-3 border-t border-green-700">
              <div className="grid grid-cols-2 gap-4">
                {/* Price Range */}
                <div>
                  <h4 className="text-xs font-semibold mb-1 text-gray-300">Price Range</h4>
                  <select
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full p-2 border border-green-700 rounded-md text-xs bg-gray-700 text-white"
                  >
                    {priceSteps.map(step => (
                      <option key={step} value={step}>Up to ₹{step}</option>
                    ))}
                  </select>
                </div>

                {/* Sorting */}
                <div>
                  <h4 className="text-xs font-semibold mb-1 text-gray-300">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border border-green-700 rounded-md text-xs bg-gray-700 text-white"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rating</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto pt-[10rem] md:pt-20">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex flex-col md:flex-row">
            {/* Desktop Filters Sidebar - Fixed */}
            <div className="hidden md:block w-64 mr-6">
              <div className="sticky top-40 bg-gray-800 p-4 rounded-lg border border-green-700 h-fit">
                <h3 className="text-lg font-semibold mb-4 text-green-400">Filters</h3>
                
                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold mb-3 text-gray-300">Price Range</h4>
                  <div className="px-2">
                    <select
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full p-2 border border-green-700 rounded-md text-sm bg-gray-700 text-white"
                    >
                      {priceSteps.map(step => (
                        <option key={step} value={step}>Up to ₹{step}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sorting */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold mb-2 text-gray-300">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border border-green-700 rounded-md text-sm bg-gray-700 text-white"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rating</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
              ) : error ? (
                <div className="text-center text-red-400 py-10">{error}</div>
              ) : (
                <>
                  {filteredProducts.length === 0 ? (
                    <div className="text-center text-green-400 font-medium py-10">
                      No wooden treasures found. Try a different search.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {filteredProducts.map((product) => (
                        <motion.div 
                          key={product._id} 
                          className="bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 border border-green-700"
                          whileHover={{ y: -5 }}
                        >
                          {/* Product Image */}
                          <div className="relative">
                            {product.images && product.images.length > 0 ? (
                              <div 
                                className="cursor-pointer"
                                onClick={() => setSelectedProduct(product)}
                              >
                                <img
                                  src={getImageUrl(product.images[0])}
                                  alt={product.name}
                                  className="w-full h-40 object-cover hover:opacity-90 transition-opacity"
                                />
                              </div>
                            ) : (
                              <div className="w-full h-40 bg-gray-700 flex items-center justify-center">
                                <span className="text-green-400 text-sm">No image available</span>
                              </div>
                            )}
                            {product.discount > 0 && (
                              <div className="absolute top-1 right-1 bg-green-700 text-white px-2 py-1 rounded text-xs font-medium">
                                {product.discount}% OFF
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="p-3 bg-gray-800">
                            <h3 className="text-sm font-semibold text-white line-clamp-1">{product.name}</h3>
                            <p className="text-xs text-gray-300 mt-1 line-clamp-2">{product.description}</p>
                        
                            {/* Product Dimensions */}
                            {product.length && product.width && product.height ? (
                              <div className="mt-1">
                                <p className="text-xs text-green-400">
                                  📏 {product.length}×{product.width}×{product.height} cm
                                </p>
                              </div>
                            ) : null}
                        
                            {/* Stock Information */}
                            {product.stock !== undefined ? (
                              <div className="mt-1">
                                <p className="text-xs text-green-400">
                                  📦 {product.stock} in stock
                                </p>
                              </div>
                            ) : null}
                        
                            {/* Price and Discount */}
                            <div className="mt-2">
                              <div className="flex items-baseline gap-1">
                                <span className="text-sm font-bold text-white">₹{product.price}</span>
                                {product.discount > 0 && (
                                  <span className="text-xs text-gray-400 line-through">
                                    ₹{Math.round(product.price * (1 + product.discount / 100))}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Quantity Controls and Add to Cart */}
                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center border border-green-700 rounded-md overflow-hidden">
                                <button
                                  onClick={() => handleQuantityChange(product._id, -1)}
                                  className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm"
                                >
                                  -
                                </button>
                                <span className="px-2 py-1 text-center min-w-[24px] bg-gray-800 text-sm text-white">
                                  {quantities[product._id] || 1}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(product._id, 1)}
                                  className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => handleAddToCart(product)}
                                className="bg-green-700 text-white px-3 py-1 rounded-md hover:bg-green-600 text-sm font-medium"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <ImageModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        quantities={quantities}
        handleQuantityChange={handleQuantityChange}
        handleAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default Products;
