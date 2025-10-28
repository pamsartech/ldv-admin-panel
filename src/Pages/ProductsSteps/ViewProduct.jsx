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
import { useAlert } from "../../Components/AlertContext";

// 🧩 Material UI
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const ViewProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false); // 🔹 MUI confirm dialog

  const { showAlert } = useAlert(); // ✅ useAlert context

  const statusColors = {
    Active: "bg-green-100 text-green-700 border border-green-300",
    Inactive: "bg-red-100 text-red-700 border border-red-300",
  };

  // 🧩 Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://dev-api.payonlive.com/api/product/product-details/${productId}`
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

  // 🧩 Delete product logic
 
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await axios.delete(
        `http://dev-api.payonlive.com/api/product/delete-product/${productId}`
      );

      if (response.data.success) {
        showAlert("Product deleted successfully!", "success");
        navigate("/user/Products");
      } else {
        showAlert(response.data.message || "Failed to delete product", "error");
      }
    } catch (err) {
      showAlert(err.response?.data?.message || err.message, "error");
    } finally {
      setIsDeleting(false);
      setOpenConfirm(false); // close confirmation dialog
    }
  };

  // 🧩 MUI Skeleton loader
  if (loading)
    return (
      <div>
        <Navbar heading="Product Management" />
        <div className="max-w-5xl mx-auto mt-10 bg-white rounded-lg shadow-sm p-6">
          <Stack spacing={3}>
            <Skeleton variant="text" width={200} height={35} animation="wave" />
            <Skeleton variant="rectangular" height={80} animation="wave" />
            <Skeleton variant="rectangular" height={60} animation="wave" />
            <Skeleton variant="text" width={180} height={35} animation="wave" />
            <Skeleton variant="rectangular" height={100} animation="wave" />
            <Skeleton variant="rectangular" height={120} animation="wave" />
            <Skeleton variant="rectangular" height={80} animation="wave" />
          </Stack>
        </div>
      </div>
    );

  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!product) return <p className="text-center mt-10">No product found</p>;

  return (
    <div>
      <Navbar heading="Product Management" />

      {/* Top controls */}
      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Product details</h1>

        <div>
          {/* 🔹 Delete Button triggers confirmation dialog */}
       
          <button
            onClick={() => setOpenConfirm(true)}
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
            onClick={() => navigate(`/user/update-product/${product._id}`)}
            className="mx-2 px-3 py-1 border rounded-md text-[#114E9D] bg-blue-50 hover:bg-blue-100"
          >
            <FontAwesomeIcon icon={faArrowRotateLeft} className="px-2" />
            Update
          </button>

          <button
            onClick={() => navigate("/user/Products")}
            className="px-3 py-1 border rounded-md text-white bg-[#02B978] hover:bg-[#04D18C]"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-white px-2" />
            Back to Main View
          </button>
        </div>
      </div>

      {/* Product details layout */}
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

            {/* Description */}
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

            {/* Color */}
            <div className="mt-3">
              <span className="text-sm font-semibold mb-2">Color:</span>
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

            <div className="border-t border-gray-300"></div>

            {/* Product details */}
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
                <span className="font-bold">€ {product.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-semibold">Category</span>
                <span>{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-semibold">Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusColors[
                      product.status
                        ? product.status.charAt(0).toUpperCase() +
                          product.status.slice(1).toLowerCase()
                        : "Inactive"
                    ] || "bg-gray-100 text-gray-600 border border-gray-300"
                  }`}
                >
                  {product.status
                    ? product.status.charAt(0).toUpperCase() +
                      product.status.slice(1).toLowerCase()
                    : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 MUI Confirmation Dialog */}
      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-description"
      >
        <DialogTitle id="confirm-delete-title">
          {"Confirm Product Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-description">
            Are you sure you want to permanently delete this product? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewProduct;

