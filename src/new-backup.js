import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SketchPicker } from "react-color";
import Navbar from "../../Components/Navbar";
import { useAlert } from "../../Components/AlertContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheck,
  faXmark,
  faPlus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

// 🧩 Material UI imports
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

function UpdateProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [btnLoading , setBtnLoading] = useState(false);

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
    status: "",
  });

  // ✅ Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `https://dev-api.payonlive.com/api/product/product-details/${productId}`
        );
        if (res.data.success) {
          const data = res.data.data;
          setProductDetails({
            productName: data.productName || "",
            productCode: data.productCode || "",
            price: data.price || "",
            stock: data.stock || "",
            category: data.category || "",
            status: data.status || "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (color) => setSelectedColor(color.hex);
  const handleColorCommit = (color) => setSelectedColor(color.hex);

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

 const handleUpdate = async (e) => {
  e.preventDefault();
  setBtnLoading(true);

  const payload = {
    productName: productDetails.productName,
    productCode: productDetails.productCode,
    price: Number(productDetails.price),
    status: productDetails.status,
    gender: selectedGender,
    color: selectedColor,
    size: selectedSize,
    stock: Number(productDetails.stock),
    category: productDetails.category,
    images: images,
  };

  try {
    const response = await axios.put(
      `https://dev-api.payonlive.com/api/product/update-product/${productId}`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data.success) {
      showAlert("Product updated successfully!", "success", () =>
        navigate("/user/products")
      );
    } else {
      showAlert("Failed to update product.", "error");
    }
  } catch (error) {
    console.error("Error updating product:", error);
    showAlert("Failed to update product.", "error");
  } finally {
    // ✅ Always stop the spinner
    setBtnLoading(false);
  }
};


  // 🧩 Skeleton Loader (replaces plain loading text)
  if (loading)
    return (
      <div>
        <Navbar heading="Payment Management" />
        <div className="max-w-6xl mx-auto mt-10 bg-white rounded-lg shadow-sm p-6">
          <Stack spacing={3}>
            <Skeleton variant="text" width={220} height={35} animation="wave" />
            <Skeleton variant="rectangular" height={80} animation="wave" />
            <Skeleton variant="rectangular" height={300} animation="wave" />
            <Skeleton variant="rectangular" height={180} animation="wave" />
            <Skeleton variant="text" width={180} height={35} animation="wave" />
            <Skeleton variant="rectangular" height={250} animation="wave" />
            <Skeleton variant="rectangular" height={120} animation="wave" />
          </Stack>
        </div>
      </div>
    );

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
                <label className="block text-sm font-medium mb-1">
                  Product Code
                </label>
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

              {/* Status Dropdown */}
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
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
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
                        <FontAwesomeIcon
                          icon={faPlus}
                          className="text-gray-600"
                        />
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
            {/* Left */}
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

            {/* Right */}
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
                  <option value="clothing">Clothing</option>
                  <option value="shoes">Shoes</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <hr className="text-gray-400 mx-10 mt-8" />
        <div className="flex justify-between max-w-5xl mx-auto my-10">

          <div className="mt-4">
          <button
            type="button"
            onClick={() => navigate("/user/Products")}
            className="px-3 py-2 border border-red-700 text-red-700 bg-red-50 rounded-md hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={faXmark} size="lg" className="px-2" />
            Discard Product
          </button></div>

        

           <div className=" mt-4">
            <button
              type="submit"
              disabled={btnLoading}
              className="bg-[#114E9D] text-white px-6 py-2 rounded-lg hover:bg-blue-500 flex items-center gap-2"
            >
              {btnLoading && (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              {btnLoading ? "Updating..." : "Update Product"}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}

export default UpdateProduct;







// this is create order code
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useAlert } from "../../Components/AlertContext";
import { colors } from "@mui/material";

const CreateOrder = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // 🔹 State for customer info
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 State for order items
  const [orderItems, setOrderItems] = useState([
    {
      productCode: "",
      productName: "",
      quantity: 1,
      price: 0,
      color: "",
      size: "",
      availableColors: [],
      availableSizes: [],
    },
  ]);

  // 🔹 State for payment & shipping
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [shippingMethod, setShippingMethod] = useState("");
  const [shippingStatus, setShippingStatus] = useState("");

  // 🔹 Validation errors + popup
  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // for check user email exist or not
  const [userExists, setUserExists] = useState(false);
  const [userChecked, setUserChecked] = useState(false);

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  // Add product row
  const addProduct = () => {
    setOrderItems([...orderItems, { productName: "", quantity: 1, price: 0 }]);
  };

  // Remove product row
  const removeProduct = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  // Update product field
  const handleProductChange = (index, value) => {
    const newItems = [...orderItems];
    newItems[index].productName = value;
    setOrderItems(newItems);
  };

  // 🔹 Validation Logic (same style as LiveEvent)
  const validate = () => {
    const newErrors = {};

    if (!customerName.trim())
      newErrors.customerName = "Customer name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Please enter a valid email.";

    if (!phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required.";
    else if (!/^\d{9,15}$/.test(phoneNumber))
      newErrors.phoneNumber = "Phone number must be 9–15 digits.";

    if (!address.trim()) newErrors.address = "Shipping address is required.";

    if (!paymentMethod.trim())
      newErrors.paymentMethod = "Select a payment method.";
    if (!paymentStatus.trim())
      newErrors.paymentStatus = "Select a payment status.";
    if (!shippingMethod.trim())
      newErrors.shippingMethod = "Select a shipping method.";
    if (!shippingStatus.trim())
      newErrors.shippingStatus = "Select a shipping status.";

    // Validate order items
    orderItems.forEach((item, idx) => {
      if (!item.productName.trim())
        newErrors[`product_${idx}`] = `Product code is required for item ${
          idx + 1
        }`;
      if (item.price <= 0)
        newErrors[`price_${idx}`] = `Price must be greater than 0 for item ${
          idx + 1
        }`;
    });

    setErrors(newErrors);
    console.log("🧾 Validation Errors:", newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔍 Fetch user by email and autofill details
  const fetchUserByEmail = async (email) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    try {
      setLoading(true);
      console.log(`🔍 Searching user by email: ${email}`);

      const res = await axios.post(
        "https://dev-api.payonlive.com/api/user/search",
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success && res.data.data) {
        const user = res.data.data;
        console.log(" User found:", user);
        setCustomerName(user.customerName || "");
        setphoneNumber(user.phoneNumber || "");
        // ✅ Combine full address into one line
        if (user.address) {
          const { street, city, state, zipcode, country } = user.address;
          const fullAddress = [street, city, state, zipcode, country]
            .filter(Boolean)
            .join(", ");
          setAddress(fullAddress || "");
          console.log("address", fullAddress);
        }
        setUserExists(true);
        setUserChecked(true);
        showAlert("User details loaded successfully!", "success");
      } else {
        // ✅ User not found (no crash)
        console.warn("⚠️ User not found:", res.data);
        setUserExists(false);
        setUserChecked(true);
        setCustomerName("");
        setphoneNumber("");
        setAddress("");
        showAlert(
          "User does not exist. Please create the user first.",
          "warning"
        );
      }
    } catch (error) {
      // ✅ Handle server-side 404 or network issues gracefully
      console.error("❌ Error fetching user:", error);

      setUserExists(false);
      setUserChecked(true);
      setCustomerName("");
      setphoneNumber("");
      setAddress("");

      // Show warning instead of error for user not found
      if (error.response && error.response.status === 404) {
        showAlert(
          "User does not exist. Please create the user first.",
          "warning"
        );
      } else {
        showAlert("Error fetching user details. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);

  if (!validate()) {
    setLoading(false);
    return;
  }

  // ✅ Format order items (remove unwanted keys)
  const formattedItems = orderItems.map((item) => ({
  productCode: item.productCode?.trim(),
  quantity: Number(item.quantity),
  size: Array.isArray(item.size)
    ? item.size.join(",") // Convert to comma-separated string
    : String(item.size || ""), // ensure it’s always a string
  color: Array.isArray(item.color)
    ? item.color.join(",") // convert array → string
    : String(item.color || ""),
}));

// const formattedItems = orderItems.map((item) => ({
//   productCode: item.productCode?.trim(),
//   quantity: Number(item.quantity),
//   size: Array.isArray(item.size)
//     ? item.size // ✅ keep as array
//     : item.size
//     ? [item.size]
//     : [],
//   color: Array.isArray(item.color)
//     ? item.color // ✅ keep as array
//     : item.color
//     ? [item.color]
//     : [],
// }));


// const formattedItems = orderItems.map((item) => ({
//   productCode: item.productCode?.trim(),
//   quantity: Number(item.quantity),
//   size: Array.isArray(item.size)
//     ? item.size
//     : item.size
//     ? [item.size]
//     : [],
//   color: Array.isArray(item.color)
//     ? item.color
//     : item.color
//     ? [item.color]
//     : [],
// }));

  // ✅ Final payload matching backend
  const payload = {
    customerName,
    email,
    phoneNumber,
    address,
    orderItems: formattedItems,
    paymentMethod,
    paymentStatus,
    shippingMethod,
    shippingStatus,
  };

  console.log("📤 Clean Payload Sent to Backend:", payload);

  try {
    const res = await axios.post(
      "https://dev-api.payonlive.com/api/order/create-order",
      payload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (res.data?.success) {
      showAlert("Order created successfully!", "success");
      navigate("/user/Orders");
    } else {
      showAlert(
        res.data?.message || "Failed to create order. Please try again.",
        "error"
      );
    }
  } catch (err) {
    console.error("❌ Server Error:", err);
    showAlert("Server error. Please try again later.", "error");
  } finally {
    setLoading(false);
  }
};


  // Fetch product details by product code
  // 🔍 Fetch product details by product code
const fetchProductByCode = async (index, code) => {
  if (!code) return;

  try {
    console.log(`🔍 Fetching product for code: ${code}`);
    const res = await axios.get(
      `https://dev-api.payonlive.com/api/product/product-code/${code}`
    );

    if (res.data.success) {
      const product = res.data.data;
      console.log("✅ Product fetched:", product);

      // 🧩 Normalize color and size
      // let normalizedColors = [];
      // let normalizedSizes = [];

      // // Handle color
      // if (Array.isArray(product.color)) {
      //   normalizedColors = product.color.filter(Boolean);
      // } else if (typeof product.color === "string" && product.color.trim() !== "") {
      //   // Sometimes color is comma-separated or single value
      //   if (product.color.includes(",")) {
      //     normalizedColors = product.color.split(",").map((c) => c.trim());
      //   } else {
      //     normalizedColors = [product.color.trim()];
      //   }
      // }

      // Handle size
      // if (Array.isArray(product.size)) {
      //   normalizedSizes = product.size.filter(Boolean);
      // } else if (typeof product.size === "string" && product.size.trim() !== "") {
      //   if (product.size.includes(",")) {
      //     normalizedSizes = product.size.split(",").map((s) => s.trim());
      //   } else {
      //     normalizedSizes = [product.size.trim()];
      //   }
      // }

      // const newItems = [...orderItems];
      // newItems[index] = {
      //   ...newItems[index],
      //   productCode: code,
      //   productName: product.productName || "",
      //   price: product.price || 0,
      //   availableColors: normalizedColors,
      //   availableSizes: normalizedSizes,
      //   color: "",
      //   size: "",
      // };

   // 🧩 Normalize color and size arrays properly
let normalizedColors = [];
let normalizedSizes = [];

// ✅ Fix color array (handles nested comma-separated strings)
if (Array.isArray(product.color)) {
  normalizedColors = product.color
    .flatMap((c) => c.split(/[,;|]/)) // split even if each entry has commas
    .map((c) => c.trim())
    .filter(Boolean);
} else if (typeof product.color === "string" && product.color.trim() !== "") {
  normalizedColors = product.color
    .split(/[,;|]/)
    .map((c) => c.trim())
    .filter(Boolean);
}

// ✅ Fix size array (same logic)
if (Array.isArray(product.size)) {
  normalizedSizes = product.size
    .flatMap((s) => s.split(/[,;|]/))
    .map((s) => s.trim())
    .filter(Boolean);
} else if (typeof product.size === "string" && product.size.trim() !== "") {
  normalizedSizes = product.size
    .split(/[,;|]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const newItems = [...orderItems];
newItems[index] = {
  ...newItems[index],
  productCode: code,
  productName: product.productName || "",
  price: product.price || 0,
  availableColors: normalizedColors,
  availableSizes: normalizedSizes,
  color: [],
  size: [],
};

setOrderItems(newItems);

      // setOrderItems(newItems);
    } else {
      console.warn("⚠️ Product not found for code:", code);
    }
  } catch (error) {
    console.error("❌ Error fetching product:", error);
  }
};


// ✅ Multi-select color handler
const handleColorSelect = (index, selectedColor) => {
  const newItems = [...orderItems];
  const currentColors = Array.isArray(newItems[index].color)
    ? [...newItems[index].color]
    : [];

  if (currentColors.includes(selectedColor)) {
    // remove if already selected
    newItems[index].color = currentColors.filter((c) => c !== selectedColor);
  } else {
    // add new color
    newItems[index].color = [...currentColors, selectedColor];
  }

  setOrderItems(newItems);
};

// ✅ Multi-select size handler
const handleSizeSelect = (index, selectedSize) => {
  const newItems = [...orderItems];
  const currentSizes = Array.isArray(newItems[index].size)
    ? [...newItems[index].size]
    : [];

  if (currentSizes.includes(selectedSize)) {
    newItems[index].size = currentSizes.filter((s) => s !== selectedSize);
  } else {
    newItems[index].size = [...currentSizes, selectedSize];
  }

  setOrderItems(newItems);
};



  // const handleColorSelect = (index, color) => {
  //   const newItems = [...orderItems];
  //   newItems[index].color = color;
  //   setOrderItems(newItems);
  // };

  // // ✅ Handle size click
  // const handleSizeSelect = (index, size) => {
  //   const newItems = [...orderItems];
  //   newItems[index].size = size;
  //   setOrderItems(newItems);
  // };

  // calculate
  const subtotal = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // Example 10%
  const shippingFee = shippingMethod === "Free Shipping" ? 0 : 7;
  const total = subtotal + tax + shippingFee;

  return (
    <div>
      <Navbar heading="Order Management" />

      {/* discard button */}
      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Order Creation</h1>
        <button
          onClick={() => navigate("/user/Orders")}
          className="px-3 py-1 border border-red-700 text-red-700 bg-red-50 rounded-md hover:bg-gray-100"
        >
          <FontAwesomeIcon
            icon={faXmark}
            size="lg"
            className="text-red-700 px-2"
          />
          Discard
        </button>
      </div>

      {/* Form wrapper */}
      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-6 sm:px-6 lg:px-8 py-6 space-y-8 font-sans text-gray-700"
      >
        {/* Create New Order */}
        <section className="border border-gray-400 rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-semibold pb-3">Create New Order</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Customer Name
              </label>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full name"
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
              {errors.customerName && (
                <p className="text-red-500 text-sm">{errors.customerName}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input
                value={email}
                // onChange={(e) => setEmail(e.target.value)}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setUserChecked(false);
                  setUserExists(false);
                }}
                // onBlur={() => fetchUserByEmail(email)}
                onBlur={(e) => fetchUserByEmail(e.target.value)}
                type="email"
                placeholder="customer@email.com"
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                phoneNumber
              </label>
              <input
                value={phoneNumber}
                onChange={(e) => setphoneNumber(e.target.value)}
                type="number"
                placeholder="+122 2313 3212"
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Shipping address
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123, main city, state"
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
            </div>
          </div>
        </section>

      
       

        {/* Order Items */}
        <section className="border border-gray-400 rounded-lg p-6 overflow-x-auto">
          <div className="flex justify-between items-center pb-3 mb-4">
            <h2 className="text-lg font-semibold">Order Items</h2>
            <button
              onClick={addProduct}
              className="flex items-center gap-2 bg-green-600 text-white text-[12px] px-3 py-2 rounded-lg hover:bg-green-700"
              type="button"
            >
              <FontAwesomeIcon icon={faPlus} /> Add product
            </button>
          </div>

          {orderItems.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-3 border-b border-gray-400"
            >
           
              <div className="md:col-span-3">
                <label className="block mb-1 text-sm font-medium">
                  Product Name
                </label>
                <input
                  value={item.productName}
                  // onChange={(e) => handleProductChange(idx, e.target.value)}
                  onChange={(e) => {
                    const newItems = [...orderItems];
                    newItems[idx].productName = e.target.value;
                    setOrderItems(newItems);
                  }}
                  onBlur={() => fetchProductByCode(idx, item.productName)}
                  placeholder="enter product code"
                  className="w-full text-sm  rounded-xl border px-2 py-2"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm">
                    {errors[`product_${idx}`]}
                  </p>
                )}
              </div>

           
            
            {/* Color Section */}
             {/* Color Section */}
<div className="md:col-span-2">
  <label className="block mb-1 text-sm font-medium">Color</label>

  {Array.isArray(item.availableColors) && item.availableColors.length > 0 ? (
    <div className="flex flex-wrap items-center gap-2 mt-1">
      {/* {item.availableColors.map((c, i) => {
        // normalize color value
        const normalizedColor = c?.trim();
        const isSelected = Array.isArray(item.color)
          ? item.color.includes(normalizedColor)
          : false;

        // detect if it's a valid color code or color name
        const bgColor =
          normalizedColor?.startsWith("#") ||
          normalizedColor?.startsWith("rgb")
            ? normalizedColor
            : normalizedColor?.toLowerCase();

        return (
          <span
            key={i}
            onClick={() => handleColorSelect(idx, normalizedColor)}
            className={`w-7 h-7 rounded-full border cursor-pointer shadow-sm transition ${
              isSelected ? "ring-2 ring-gray-800 scale-105" : ""
            }`}
            style={{
              backgroundColor: bgColor || "#ccc",
            }}
            title={normalizedColor}
          ></span>
        );
      })} */}

      {item.availableColors.map((c, i) => {
  const normalizedColor = c?.trim();
  const isSelected = Array.isArray(item.color)
    ? item.color.includes(normalizedColor)
    : false;

  // ✅ Safely detect color value
  let bgColor = "#ccc";
  if (
    /^#([0-9A-F]{3}){1,2}$/i.test(normalizedColor) || // hex color
    /^rgb/.test(normalizedColor) || // rgb/rgba
    /^[a-zA-Z]+$/.test(normalizedColor) // named color
  ) {
    bgColor = normalizedColor;
  }

  return (
    <span
      key={i}
      onClick={() => handleColorSelect(idx, normalizedColor)}
      className={`w-7 h-7 rounded-full border cursor-pointer shadow-sm transition ${
        isSelected ? "ring-2 ring-gray-800 scale-105" : ""
      }`}
      style={{ backgroundColor: bgColor }}
      title={normalizedColor}
    ></span>
  );
})}

    </div>
  ) : (
    <select
      value={Array.isArray(item.color) ? item.color[0] || "" : item.color || ""}
      onChange={(e) => handleColorSelect(idx, e.target.value)}
      className="w-full text-sm border rounded-lg px-2 py-2"
    >
      <option value="">Select color</option>
      <option value="White">White</option>
      <option value="Red">Red</option>
      <option value="Black">Black</option>
      <option value="Brown">Brown</option>
    </select>
  )}
</div>


{/* Size Section */}
{/* Size Section */}
<div className="md:col-span-2">
  <label className="block mb-1 text-sm font-medium">Size</label>

  {Array.isArray(item.availableSizes) && item.availableSizes.length > 0 ? (
    <div className="flex flex-wrap items-center gap-2 mt-1">
      {item.availableSizes.map((sz, i) => {
        const isSelected = Array.isArray(item.size)
          ? item.size.includes(sz)
          : false;
        return (
          <span
            key={i}
            onClick={() => handleSizeSelect(idx, sz)}
            className={`w-8 h-8 flex items-center justify-center text-sm rounded-full cursor-pointer border transition ${
              isSelected
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {sz}
          </span>
        );
      })}
    </div>
  ) : (
    <div className="flex flex-wrap items-center gap-2 mt-1">
      {["S", "M", "L", "XL"].map((sz) => {
        const isSelected = Array.isArray(item.size)
          ? item.size.includes(sz)
          : false;
        return (
          <span
            key={sz}
            onClick={() => handleSizeSelect(idx, sz)}
            className={`w-8 h-8 flex items-center justify-center text-sm rounded-full cursor-pointer border transition ${
              isSelected
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {sz}
          </span>
        );
      })}
    </div>
  )}
</div>


             

              {/* Quantity dropdown */}
              <div className="md:col-span-1 text-center">
                <label className="block mb-1 text-start text-sm font-medium">
                  Quantity
                </label>
                <select
                  value={item.quantity}
                  onChange={(e) => {
                    const newItems = [...orderItems];
                    newItems[idx].quantity = parseInt(e.target.value, 10);
                    setOrderItems(newItems);
                  }}
                  className="w-full text-sm border rounded-lg px-2 py-2"
                >
                  {[...Array(20)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price input */}
              <div className="md:col-span-1 text-center">
                <label className="block mb-1 text-start text-sm font-medium">
                  Price
                </label>
                <input
                  readOnly
                  type="number"
                  value={item.price}
                  className="w-full text-sm border rounded-lg px-2 py-2 text-center"
                />
              
              </div>

              {/* Total auto-calculated (read-only) */}
              <div className="md:col-span-1 text-center">
                <label className="block mb-1 text-start text-sm font-medium">
                  Total
                </label>
                <input
                  type="text"
                  readOnly
                  value={(item.price * item.quantity).toFixed(2)}
                  className="w-full text-sm border rounded-lg px-2 py-2 text-center "
                />
              </div>

              {/* Remove button */}
              <div className="md:col-span-2 flex justify-center">
                <button
                  onClick={() => removeProduct(idx)}
                  className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-red-100"
                  type="button"
                >
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-red-600 text-sm"
                  />
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Payment Details */}
        <section className="border border-gray-400 rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 text-sm font-medium">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">Select Payment method</option>
              <option>Stripe</option>
              <option>Paypal</option>
            </select>
            {errors.paymentMethod && (
              <p className="text-red-500 text-sm">{errors.paymentMethod}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Payment Status
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">Select payment status</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Failed</option>
            </select>
            {errors.paymentStatus && (
              <p className="text-red-500 text-sm">{errors.paymentStatus}</p>
            )}
          </div>
        </section>

        {/* Shipping Details */}
        <section className="border border-gray-400 rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 text-sm font-medium">
              Shipping Method
            </label>
            <select
              value={shippingMethod}
              onChange={(e) => setShippingMethod(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">Select Shipping method</option>
              <option>Flat Rate</option>
              <option>Express</option>
              <option>Local Pickup</option>
            </select>
            {errors.shippingMethod && (
              <p className="text-red-500 text-sm">{errors.shippingMethod}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Shipping Status
            </label>
            <select
              value={shippingStatus}
              onChange={(e) => setShippingStatus(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">Select shipping status</option>
              <option>Shipped</option>
              <option>Pending</option>
              <option>Processing</option>
              <option>Delivered</option>
            </select>
            {errors.shippingStatus && (
              <p className="text-red-500 text-sm">{errors.shippingStatus}</p>
            )}
          </div>
        </section>

        {/* Order Summary */}
        <section className="border border-gray-400 rounded-lg p-4 w-full sm:w-80">
          <h3 className="font-semibold mb-4 text-sm text-gray-700">
            Order Summary
          </h3>
          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex justify-between">
              <span>Sub Total</span>
              <span> € {subtotal} </span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span> € {tax} </span>
            </div>
          
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span>€ {shippingFee} </span>
            </div>
            <div className="border-t border-gray-400 mt-5 pt-2 font-semibold flex justify-between">
              <span>Total</span>
              <span>€ {total} </span>
            </div>
          </div>
        </section>

        {/* Submit Button */}
     

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            {loading && (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {loading ? "Submitting..." : "Submit Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrder;
