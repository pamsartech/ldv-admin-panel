import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRotateLeft,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const ViewProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams(); // expecting product ID from route
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `https://la-dolce-vita.onrender.com/api/product/product-details/${productId}` // <-- update API endpoint
        );
        if (res.data.success) {
          setProduct(res.data.data);
        } else {
          setError(res.data.message || "Failed to fetch product");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Something went wrong while fetching product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <p className="text-center mt-10">Loading product...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  if (!product) {
    return <p className="text-center mt-10">No product found</p>;
  }

  // Delete product
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      const response = await axios.delete(
        `https://la-dolce-vita.onrender.com/api/product/delete-product/${productId}`
      );

      if (response.data.success) {
        alert("Product deleted successfully!");
        navigate("/Products");
      } else {
        alert(
          `Failed to delete product: ${
            response.data.message || "Unknown error"
          }`
        );
      }
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <Navbar heading="Product Management" />

      {/* discard button */}
      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Product details</h1>

        <div>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`px-3 py-1 border rounded-md ${
              isDeleting
                ? "bg-gray-300 text-gray-500"
                : "text-[#B21E1E] bg-red-50 hover:bg-red-100"
            }`}
          >
            <FontAwesomeIcon icon={faTrashCan} className="px-2" />
            {isDeleting ? "Deleting..." : "Delete product"}
          </button>

          <button
            onClick={() => navigate(`/update-product/${product._id}`)}
            className="mx-2 px-3 py-1 border rounded-md text-[#114E9D] bg-blue-50 hover:bg-blue-100"
          >
            <FontAwesomeIcon icon={faArrowRotateLeft} className="px-2" />
            Update
          </button>

          <button
            onClick={() => navigate("/Products")}
            className="px-3 py-1 border rounded-md text-white bg-[#02B978] hover:bg-[#04D18C]"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-white px-2" />
            Back to Main View
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-10 my-8 font-sans">
        <div className="rounded-2xl border border-gray-300 bg-[#fdfcf9] p-6 md:p-8 flex flex-col md:flex-row gap-10">
          {/* Left column */}
          <div className="flex-1 min-w-[300px]">
            <h2 className="text-lg font-semibold mb-1">Product name</h2>
            <h1 className="text-xl font-medium mt-5 mb-5">
              {product.productName}
            </h1>

            {/* Images */}
            <div className="flex gap-4 mb-6">
              {product.images && product.images.length > 0 ? (
                product.images.map((img, i) => {
                  // Full URL if needed
                  const imageUrl = img.startsWith("http")
                    ? img
                    : `https://la-dolce-vita.onrender.com${img}`;
                  return (
                    <img
                      key={i}
                      src={imageUrl}
                      alt={product.productName}
                      className="w-20 h-20 rounded-xl border border-gray-300 object-cover"
                    />
                  );
                })
              ) : (
                <p>No images available</p>
              )}

            </div>

            {/* Description placeholder */}
            <div className="mt-10">
              <h3 className="text-sm font-semibold mb-2">
                Product description
              </h3>
              <div className="rounded-xl bg-[#f5f6f7] py-4 text-base text-gray-700 leading-relaxed">
                <p className="px-5">No description provided.</p>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="w-full md:max-w-[340px] flex flex-col gap-6">
            {/* Gender */}
            <div>
              <span className="block text-sm font-semibold mb-2">Gender</span>
              <div className="flex gap-3">
                <button className="bg-[#7252b1] text-white font-medium px-4 py-1.5 rounded-lg shadow">
                  {product.gender}
                </button>
              </div>
            </div>

            {/* Colours */}
            {/* <div>
              <span className="block text-sm font-semibold mb-2">Colour</span>
              <div className="flex gap-3">
                <span className="px-3 py-1 rounded-lg border border-gray-300">
                  {product.color}
                </span>
              </div>
            </div> */}

            {/* Colors */}
            <div className="mt-3">
              <span className="text-sm font-semibold mb-2 ">Color:</span>
              <div className="mt-2 flex flex-wrap gap-4">
                {Array.isArray(product.color) ? (
                  product.color.map((c, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <span
                        className="w-6 h-6 rounded-full border border-gray-300 cursor-pointer"
                        style={{ backgroundColor: c }}
                      ></span>
                      <span className="text-xs text-gray-600 mt-1">{c}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center">
                    <span
                      className="w-6 h-6 rounded-full border border-gray-400 cursor-pointer"
                      style={{ backgroundColor: product.color }}
                    ></span>
                  </div>
                )}
              </div>
            </div>

            {/* Size */}
            <div>
              <span className="block text-sm font-semibold mb-2">Size</span>
              <div className="flex gap-3">
                <button className="bg-[#7252b1] text-white text-base rounded-lg px-4 py-1.5 shadow font-medium">
                  {product.size}
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-300"></div>

            {/* Product Details */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 font-semibold">
                  Product Code
                </span>
                <span>{product.productCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-semibold">Stock</span>
                <span>{product.stock}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-semibold">Price</span>
                <span className="font-bold"> € {product.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-semibold">Category</span>
                <span>{product.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
