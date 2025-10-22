import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SketchPicker } from "react-color";
import Navbar from "../../Components/Navbar";
import { useAlert } from "../../Components/AlertContext"; // Make sure path is correct
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheck,
  faXmark,
  faPlus,
  faTimes,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function UpdateProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [loading, setLoading] = useState(true);

  const [selectedGender, setSelectedGender] = useState("Men");
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("#FF0000");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [images, setImages] = useState([]);

  const [productDetails, setProductDetails] = useState({
    productName: "",
    productCode: "",
    price: "",
    stock: "",
    category: "",
    status: "", // ✅ Added status field
  });

  // ✅ Fetch product details on mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://dev-api.payonlive.com/api/product/product-details/${productId}`
        );
        if (res.data.success) {
          const data = res.data.data;

          setProductDetails({
            productName: data.productName || "",
            productCode: data.productCode || "",
            price: data.price || "",
            stock: data.stock || "",
            category: data.category || "",
            status: data.status || "", // ✅ Pre-fill status if available
          });

          setSelectedGender(data.gender || "Men");
          setSelectedSize(data.size || "M");
          setSelectedColor(data.color || "#FF0000");
          setImages(data.images || []);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // ✅ Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle color picker
  const handleColorChange = (color) => setSelectedColor(color.hex);
  const handleColorCommit = (color) => setSelectedColor(color.hex);

  // ✅ Image handling (preview only, no actual upload)
  const handleImageUpload = (event, index) => {
    const file = event.target.files[0];
    if (!file) return;

    const newImage = URL.createObjectURL(file);
    setImages((prev) => {
      const updated = [...prev];
      updated[index] = newImage;
      return updated;
    });
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Update product API call
  const handleUpdate = async (e) => {
    e.preventDefault();

    const payload = {
      productName: productDetails.productName,
      productCode: productDetails.productCode,
      price: Number(productDetails.price),
      status: productDetails.status, // ✅ Added to payload
      gender: selectedGender,
      color: selectedColor,
      size: selectedSize,
      stock: Number(productDetails.stock),
      category: productDetails.category,
      images: images,
    };

    try {
      const response = await axios.put(
        `https://la-dolce-vita.onrender.com/api/product/update-product/${productId}`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        showAlert("Product updated successfully!", "success", () => {
          navigate("/user/products"); // navigate after clicking OK
        });
      } else {
        // alert(response.data.message || "❌ Failed to update product.");
        showAlert("Failed to update product.", "error");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert(error?.response?.data?.message || "⚠️ Failed to update product.");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading product details...</p>;
  }

  return (
    <div>
      <Navbar heading="Payment Management" />

      {/* Top Bar */}
      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Update Product Details</h1>
        <button
          onClick={() => navigate("/user/Products")}
          className="px-3 py-1 border rounded-md text-white bg-[#02B978] hover:bg-[#04D18C]"
        >
          <FontAwesomeIcon icon={faArrowLeft} size="lg" className="px-2" />
          Back to Main View
        </button>
      </div>

      <form onSubmit={handleUpdate}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mx-10 mt-10">
          {/* Basic Info */}
            <section className="border border-gray-300 rounded-xl shadow-sm p-7 bg-gray-50">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  required
                  type="number"
                  name="price"
                  value={productDetails.price}
                  onChange={handleChange}
                  placeholder="€12"
                  className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  required
                  type="text"
                  name="productName"
                  value={productDetails.productName}
                  onChange={handleChange}
                  placeholder="Product Name"
                  className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Product Code</label>
                <input
                  required
                  type="text"
                  name="productCode"
                  value={productDetails.productCode}
                  onChange={handleChange}
                  placeholder="3211"
                  className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              {/* ✅ Status Dropdown */}
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  required
                  name="status"
                  value={productDetails.status}
                  onChange={handleChange}
                  className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </section>

          {/* Image Upload */}
          <section className="bg-gray-100 mx-auto p-6 rounded-2xl w-full max-w-5xl">
            <h3 className="font-semibold text-gray-800 mb-3">Upload Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Image */}
              <div className="relative col-span-2">
                <label
                  htmlFor="mainImageUpload"
                  className="flex flex-col items-center justify-center border-2 border-gray-300 rounded-xl h-64 cursor-pointer bg-white hover:bg-gray-50 overflow-hidden"
                >
                  {images[0] ? (
                    <img
                      src={images[0]}
                      alt="Main Upload"
                      className="h-full w-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-500">Add Main Image</span>
                  )}
                </label>
                <input
                  id="mainImageUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 0)}
                />
                {images[0] && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(0)}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1"
                  >
                    <FontAwesomeIcon icon={faTimes} size="sm" />
                  </button>
                )}
              </div>

              {/* Side Images */}
              <div className="flex flex-col gap-3">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="relative">
                    <label
                      htmlFor={`sideImageUpload-${index}`}
                      className="w-15 h-15 flex items-center justify-center bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 overflow-hidden"
                    >
                      {images[index] ? (
                        <img
                          src={images[index]}
                          alt={`Upload ${index}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faPlus} className="text-gray-600" />
                      )}
                    </label>
                    <input
                      id={`sideImageUpload-${index}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, index)}
                    />
                    {images[index] && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1"
                      >
                        <FontAwesomeIcon icon={faTimes} size="sm" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Color / Size / Stock */}
        <section className="p-6 border border-gray-300 rounded-2xl shadow-md bg-gray-50 mx-10 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Gender */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Gender</h3>
                <div className="flex gap-3">
                  {["Men", "Women", "Unisex"].map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => setSelectedGender(gender)}
                      className={`px-4 py-2 rounded-lg border transition ${
                        selectedGender === gender
                          ? "bg-[#6750A4] text-white"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Colour</h3>
                <div className="flex gap-3 items-center flex-wrap">
                  <div
                    className={`w-8 h-8 rounded-full border cursor-pointer ring-2 ring-purple-600 scale-110`}
                    style={{ backgroundColor: selectedColor }}
                    onClick={() => setShowColorPicker(!showColorPicker)}
                  ></div>
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-8 h-8 rounded-full border flex items-center justify-center text-gray-600 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
                {showColorPicker && (
                  <div className="mt-3">
                    <SketchPicker
                      color={selectedColor}
                      onChange={handleColorChange}
                      onChangeComplete={handleColorCommit}
                    />
                  </div>
                )}
              </div>

              {/* Sizes */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Size</h3>
                <div className="flex gap-3 flex-wrap">
                  {["XS", "S", "M", "L", "XL"].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border transition ${
                        selectedSize === size
                          ? "bg-[#6750A4] text-white"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Stock</h3>
                <input
                  required
                  type="number"
                  name="stock"
                  value={productDetails.stock}
                  onChange={handleChange}
                  className="w-full border rounded-lg border-gray-400 px-3 py-2 bg-gray-50"
                />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Category</h3>
                <select
                  required
                  name="category"
                  value={productDetails.category}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-400 rounded-lg px-3 py-2"
                >
                  <option value="">Select Category</option>
                  <option value="Jacket">Jacket</option>
                  <option value="Shoes">Shoes</option>
                  <option value="T-shirt">T-shirt</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Buttons */}
        <hr className="text-gray-400 mx-10 mt-8" />
        <div className="flex justify-between max-w-5xl mx-auto my-10">
          <button
            type="button"
            onClick={() => navigate("/user/Products")}
            className="px-3 py-1 border border-red-700 text-red-700 bg-red-50 rounded-md hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={faXmark} size="lg" className="px-2" />
            Discard Product
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-[#114E9D] text-white rounded-lg hover:bg-blue-500"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateProduct;


