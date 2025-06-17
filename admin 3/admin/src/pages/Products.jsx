import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import adminApi from "../services/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const toastShownRef = useRef(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "shop all",
    stock: "",
    length: "",
    width: "",
    height: "",
    images: [],
    imagePreviews: [],
    discount: 0,
    isDiscountActive: false,
    discountStartDate: "",
    discountEndDate: "",
    offerPrice: "",
    offerStartDate: "",
    offerEndDate: "",
    isOfferActive: false,
  });

  const CATEGORIES = [
    "Shop all",
    "Sanchi Stupa",
    "Warli House",
    "Tiger Crafting",
    "Bamboo Peacock",
    "Miniaure Ship",
    "Bamboo Trophy",
    "Bamboo Ganesha",
    "Bamboo Swords",
    "Tribal Mask -1",
    "Tribal Mask -2",
    "Bamboo Dry Fruit Tray",
    "Bamboo Tissue Paper Holder",
    "Bamboo Strip Tray",
    "Bamboo Mobile Booster",
    "Bamboo Card-Pen Holder"
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await adminApi.products.getAll();
        setProducts(response.data);
        if (!toastShownRef.current) {
          toast.success("Products loaded successfully");
          toastShownRef.current = true;
        }
      } catch (error) {
        console.error("Failed to load products:", error);
        if (!toastShownRef.current) {
          toast.error("Failed to load products");
          toastShownRef.current = true;
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    return () => {
      toastShownRef.current = false;
    };
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (formData.images.length + files.length > 4) {
      toast.error("Maximum 4 images allowed");
      return;
    }

    const invalidFiles = files.filter((file) => file.size > 2 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      toast.error("Some images exceed 2MB limit");
      return;
    }

    const getFileIdentifier = (file) => `${file.name}-${file.size}`;
    const existingFileIdentifiers = new Set(
      formData.images.map(getFileIdentifier)
    );
    const duplicateFiles = files.filter((file) =>
      existingFileIdentifiers.has(getFileIdentifier(file))
    );

    if (duplicateFiles.length > 0) {
      toast.error("Some images are already added");
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
      imagePreviews: [...prev.imagePreviews, ...newPreviews],
    }));
  };

  const removeImage = (index) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      const newPreviews = [...prev.imagePreviews];

      URL.revokeObjectURL(newPreviews[index]);

      newImages.splice(index, 1);
      newPreviews.splice(index, 1);

      return {
        ...prev,
        images: newImages,
        imagePreviews: newPreviews,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Capitalize category to match enum
      const capitalizeCategory = (cat) => cat.replace(/\b\w/g, c => c.toUpperCase());
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key !== "images" && key !== "imagePreviews") {
          if (key === "category") {
            formDataToSend.append(key, capitalizeCategory(formData[key]));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      formData.images.forEach((image) => {
        formDataToSend.append(`images`, image);
      });

      formDataToSend.append("isAvailable", true);
      formDataToSend.append("expiryDays", 7);

      let response;
      if (editingProductId) {
        response = await adminApi.products.update(
          editingProductId,
          formDataToSend
        );
        toast.success("Product updated successfully!");
      } else {
        response = await adminApi.products.create(formDataToSend);
        toast.success("Product created successfully!");
      }

      const productsResponse = await adminApi.products.getAll();
      setProducts(productsResponse.data);

      setIsModalOpen(false);
      setEditingProductId(null);
    } catch (error) {
      console.error("Failed to save product:", error);
      toast.error(error.response?.data?.error || "Failed to save product");
    }
  };

  const handleEdit = async (product) => {
    try {
      setEditingProductId(product._id);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
        length: product.length || "",
        width: product.width || "",
        height: product.height || "",
        images: [],
        imagePreviews: product.images.map((image) => getImageUrl(image)),
        discount: product.discount || 0,
        isDiscountActive: product.isDiscountActive || false,
        discountStartDate: product.discountStartDate || "",
        discountEndDate: product.discountEndDate || "",
        offerPrice: product.offerPrice || "",
        offerStartDate: product.offerStartDate || "",
        offerEndDate: product.offerEndDate || "",
        isOfferActive: product.isOfferActive || false,
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to load product for editing:", error);
      toast.error("Failed to load product for editing");
    }
  };

  const handleDelete = async (productId) => {
    try {
      await adminApi.products.delete(productId);
      const response = await adminApi.products.getAll();
      setProducts(response.data);
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error(error.response?.data?.error || "Failed to delete product");
    }
  };

  const calculateDiscount = (price, offerPrice) => {
    if (!offerPrice) return 0;
    return Math.round(((price - offerPrice) / price) * 100);
  };

  const calculateDiscountedPrice = (price, discount) => {
    if (!discount) return price;
    return price - (price * discount) / 100;
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    const cleanPath = imagePath.replace(/^\/+/, '');
    return `${API_URL}/${cleanPath}`;
  };

  return (
    <div className="p-4 md:p-6 bg-gray-900 min-h-screen pb-20 md:pb-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Products Management
        </h1>
        <button
          onClick={() => {
            setFormData({
              name: "",
              description: "",
              price: "",
              category: "shop all",
              stock: "",
              length: "",
              width: "",
              height: "",
              images: [],
              imagePreviews: [],
              discount: 0,
              isDiscountActive: false,
              discountStartDate: "",
              discountEndDate: "",
              offerPrice: "",
              offerStartDate: "",
              offerEndDate: "",
              isOfferActive: false,
            });
            setIsModalOpen(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200 w-full md:w-auto flex items-center justify-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col border border-green-600"
          >
            {/* Product Image */}
            <div className="w-full h-48 relative group overflow-hidden">
              {product.isOfferActive && (
                <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded-md text-sm font-bold">
                  {calculateDiscount(product.price, product.offerPrice)}% OFF
                </div>
              )}
              {product.images && product.images.length > 0 ? (
                <div className="relative h-full">
                  <img
                    src={getImageUrl(product.images[0])}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                  {product.images.length > 1 && (
                    <div className="absolute bottom-0 right-0 p-2 flex gap-2">
                      {product.images.slice(1).map((image, index) => (
                        <img
                          key={index}
                          src={getImageUrl(image)}
                          alt={`${product.name} ${index + 2}`}
                          className="w-12 h-12 object-contain rounded-lg border-2 border-gray-800"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <p className="text-sm font-semibold text-white">
                  {product.name}
                </p>
                <p className="text-xs text-gray-400">
                  {product.length && product.width && product.height 
                    ? `${product.length}×${product.width}×${product.height} cm`
                    : 'Dimensions not set'
                  }
                </p>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-sm font-bold text-green-400">
                  ₹{product.price.toLocaleString()}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 rounded bg-gray-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded bg-gray-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-green-600">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">
                  {editingProductId ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingProductId(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-green-500 focus:ring-green-500"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category.toLowerCase()}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Length (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.length}
                      onChange={(e) =>
                        setFormData({ ...formData, length: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Width (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.width}
                      onChange={(e) =>
                        setFormData({ ...formData, width: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) =>
                        setFormData({ ...formData, height: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Product Images (up to 4)
                  </label>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {formData.imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-contain rounded-lg border border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {formData.imagePreviews.length < 4 && (
                      <div className="border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center h-32">
                        <label className="cursor-pointer p-4 text-center">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          <div className="text-gray-400">
                            <svg
                              className="mx-auto h-8 w-8"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            <p className="mt-1 text-sm">Add Images</p>
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={(e) => {
                      const discount = parseFloat(e.target.value) || 0;
                      setFormData({
                        ...formData,
                        discount,
                        isDiscountActive: discount > 0,
                      });
                    }}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                {formData.discount > 0 && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Discount Start Date
                        </label>
                        <input
                          type="date"
                          value={formData.discountStartDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              discountStartDate: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Discount End Date
                        </label>
                        <input
                          type="date"
                          value={formData.discountEndDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              discountEndDate: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                    </div>
                    <div className="bg-green-900/30 p-4 rounded-md border border-green-600">
                      <p className="text-sm text-green-300">
                        Discounted Price: ₹
                        {calculateDiscountedPrice(
                          formData.price,
                          formData.discount
                        ).toFixed(2)}
                      </p>
                    </div>
                  </>
                )}

                <div className="sticky bottom-0 left-0 right-0 z-10 bg-gray-800 border-t border-green-600 flex gap-4 pt-0 pb-2 px-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingProductId(null);
                    }}
                    className="flex-1 bg-gray-700 text-white px-2 py-1 text-sm rounded hover:bg-gray-600 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1 text-sm rounded transition-colors duration-200"
                  >
                    {editingProductId ? "Update Product" : "Add Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
