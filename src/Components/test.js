import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const CreateOrder = () => {
  const navigate = useNavigate();

  // 🔹 State for customer info
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [address, setAddress] = useState("");

  // 🔹 State for order items
  const [orderItems, setOrderItems] = useState([
    { productName: "", quantity: 3, price: 28.23 },
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
        newErrors[`product_${idx}`] = `Product name is required for item ${
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

  // 🔹 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      customerName,
      email,
      phoneNumber,
      address,
      orderItems,
      paymentMethod,
      paymentStatus,
      shippingMethod,
      shippingStatus,
      orderTotal : total
    };

    console.log("📤 Sending order:", payload);

    try {
      const res = await axios.post(
        "https://la-dolce-vita.onrender.com/api/order/create-order",
        payload, { headers: { "Content-Type": "application/json" } }
      );
      console.log("✅ Order created:", res.data);
      if (res.data?.success || res.status === 200) {
        setPopupMessage("Order created successfully!");
        setShowPopup(true);
        setTimeout(() => {
          console.log("Redirecting to /Orders");
          navigate("/Orders");
        }, 1500);
      } else {
        setPopupMessage(res.data.message || "Failed to create order ❌");
        setShowPopup(true);
      }
    } catch (err) {
      console.error("Sever Error  while creating order:", err);
      setPopupMessage("Server error — please try again.");
      setShowPopup(true);
    }
  };

  // calculate
  const subtotal = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // Example 10%
  const shippingFee = shippingMethod === "Free Shipping" ? 0 : 5;
  const total = subtotal + tax + shippingFee;

  return (
    <div>
      <Navbar heading="Order Management" />

      {/* discard button */}
      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Order Creation</h1>
        <button
          onClick={() => navigate("/Orders")}
          className="px-3 py-1 border border-red-700 text-red-700 bg-red-50 rounded-md hover:bg-gray-100"
        >
          <FontAwesomeIcon
            icon={faXmark}
            size="lg"
            className="text-red-700 px-2"
          />
          Discard Product
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
                onChange={(e) => setEmail(e.target.value)}
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
        {/* <section className="border border-gray-400 rounded-lg p-6 overflow-x-auto">
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
              <div className="md:col-span-5">
                <select
                  value={item.product}
                  onChange={(e) => handleProductChange(idx, e.target.value)}
                  className="w-full text-sm bg-gray-100 rounded-xl border px-2 py-2"
                >
                  <option value="">Select product</option>
                  <option>Product A</option>
                  <option>Product B</option>
                  <option>Product C</option>
                </select>
              </div>

              <div className="md:col-span-1 text-center">{item.quantity}</div>
              <div className="md:col-span-2 text-center">€ {item.price.toFixed(2)}</div>
              <div className="md:col-span-2 text-center">
                € {(item.price * item.quantity).toFixed(2)}
              </div>
              <div className="md:col-span-2 flex justify-center">
                <button
                  onClick={() => removeProduct(idx)}
                  className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-red-100"
                  type="button"
                >
                  <FontAwesomeIcon icon={faTrash} className="text-red-600 text-sm" />
                </button>
              </div>
            </div>
          ))}
        </section> */}

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
              {/* Product dropdown */}
              <div className="md:col-span-4">
                <label className="block mb-1 text-sm font-medium">
                  Product Name
                </label>
                <select
                  value={item.productName}
                  onChange={(e) => handleProductChange(idx, e.target.value)}
                  className="w-full text-sm  rounded-xl border px-2 py-2"
                >
                  <option value="">Select product</option>
                  <option>Travel bag</option>
                  <option>clothes</option>
                  <option>boots</option>
                </select>
                {errors[`product_${idx}`] && (
                  <p className="text-red-500 text-sm">
                    {errors[`product_${idx}`]}
                  </p>
                )}
              </div>

              {/* Quantity dropdown */}
              <div className="md:col-span-2 text-center">
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
              <div className="md:col-span-2 text-center">
                <label className="block mb-1 text-start text-sm font-medium">
                  Price
                </label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={item.price}
                  onChange={(e) => {
                    const newItems = [...orderItems];
                    newItems[idx].price = parseFloat(e.target.value) || 0;
                    setOrderItems(newItems);
                  }}
                  className="w-full text-sm border rounded-lg px-2 py-2 text-center"
                />
                {errors[`price_${idx}`] && (
                  <p className="text-red-500 text-sm">{errors[`price_${idx}`]}</p>
                )}
              </div>

              {/* Total auto-calculated (read-only) */}
              <div className="md:col-span-2 text-center">
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
              <option>Free Shipping</option>
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
            {/* <div className="flex justify-between">
            <span>Discount</span>
            <span>€ 12.44</span>
          </div> */}
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
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-600 text-white font-semibold rounded-lg px-5 py-2 text-sm hover:bg-green-700"
          >
            Submit Order
          </button>
        </div>
      </form>
       {/* ✅ Popup */}
      {showPopup && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white text-black font-bold px-8 py-10 rounded-xl shadow-xl min-w-[300px] text-center">
            {popupMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOrder;





// this is update product backup code 
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SketchPicker } from "react-color";
import Navbar from "../../Components/Navbar";
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
  });

  // ✅ Fetch product details on mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `https://la-dolce-vita.onrender.com/api/product/product-details/${productId}`
        );
        if (res.data.success) {
          const data = res.data.data;

          setProductDetails({
            productName: data.productName || "",
            productCode: data.productCode || "",
            price: data.price || "",
            stock: data.stock || "",
            category: data.category || "",
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
        alert("✅ Product updated successfully!");
        navigate("/Products");
      } else {
        alert(response.data.message || "❌ Failed to update product.");
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
          onClick={() => navigate("/Products")}
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
            onClick={() => navigate("/Products")}
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












// this is create payment backup code 
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCreditCard,
  faStickyNote,
  faClock,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useAlert } from "../../Components/AlertContext";

export default function CreatePayment() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // 🔹 State for customer details
  const [customerName, setCustomerName] = useState("");
  const [customerID, setCustomerID] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // 🔹 State for order details
  const [orderID, setOrderID] = useState("");
  const [transactionID, setTransactionID] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const [deliveryStatus, setDeliveryStatus] = useState("Pending");
  const [date, setdate] = useState("");
  const [notes, setNotes] = useState("");

  // 🔹 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {

    // customerName,
    // customerID, 
    // email,
    // phoneNumber,
    // orderID,
    // transactionID,
    // amount: parseFloat(amount.replace(/[^0-9.]/g, "")),
    // paymentMethod, 
    // paymentStatus,
    // deliveryStatus,
    // date: new Date(date).getTime(),
    // notes,

    
       customerName: customerName.trim(),
      customerID: customerID.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
      orderID: orderID.trim(),
      transactionID: transactionID.trim(),
      amount: parseFloat(amount.replace(/[^0-9.]/g, "")) || 0,
      paymentMethod,
      paymentStatus,
      deliveryStatus,
      date: date ? new Date(date).getTime() : null,
      notes: notes.trim(),

      // customerName,
      // customerID,
      // email,
      // phoneNumber,
      // orderID,
      // transactionID,
      // amount,
      // paymentMethod,
      // paymentStatus,
      // deliveryStatus,
      // date,
      // notes,
    };

    console.log("📤 Sending payment:", payload);

    try {
      const res = await axios.post(
        "http://dev-api.payonlive.com/api/payment/create-payment",
        payload
      );
      console.log("✅ Payment created:", res.data);
      showAlert("Payment created successfully!", "success");
      // alert("Payment created successfully!");
      navigate("/user/Payments");
    } catch (err) {
      console.error("❌ Error creating payment:", err);
      // alert("Failed to create payment.");
      showAlert("Failed to create payment. Please try again.", "error");
    }
  };

  // Helper function to get CSS class based on status

  return (
    <div>
      <Navbar heading="Payment Management" />

      {/* discard button */}
      <div className="flex justify-between mt-5 mx-10">
        <h1 className=" font-medium  text-lg">Create Payment</h1>

        <button
          onClick={() => navigate("/user/Payments")}
          className=" px-3 py-1 mr-50 border rounded-md text-white bg-[#02B978] hover:bg-[#04D18C]"
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            size="lg"
            className="text-white px-2"
          />
          Back to Main View
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 max-w-5xl mx-5 space-y-6">
        {/* Customer Details */}
        <div className="border border-gray-400 rounded-2xl p-6">
          <h2 className="text-lg font-medium mb-4">Customer Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Customer Name
              </label>
              <input
                required
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full name"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Customer ID
              </label>
              <input
                required
                type="text"
                value={customerID}
                onChange={(e) => setCustomerID(e.target.value)}
                placeholder="#121214131"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                E-mail Address
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jamesmith12@gmail.com"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Phone number
              </label>
              <input
                required
                type="number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+121 1231 1212"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
        {/* Order Details */}
        <div className="border border-gray-400 rounded-2xl p-6">
          <h2 className="text-lg font-medium mb-4">Order Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Order ID</label>
              <input
                required
                type="text"
                value={orderID}
                onChange={(e) => setOrderID(e.target.value)}
                placeholder="#1811"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Transaction ID
              </label>
              <input
                required
                type="text"
                value={transactionID}
                onChange={(e) => setTransactionID(e.target.value)}
                placeholder="#qwivq12561"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount*</label>
              <input
                required
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="€ 12.99"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Payment Method*
              </label>
              <select
                required
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border border-gray-400 text-gray-500 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select</option>
                <option>Stripe</option>
                <option>PayPal</option>
                <option>Credit Card</option>
                <option>Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full border border-gray-400 text-gray-500 rounded-lg px-3 py-2 text-sm"
              >
                <option>Pending</option>
                <option>Paid</option>
                <option>Failed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Delivery Status
              </label>
              <select
                value={deliveryStatus}
                onChange={(e) => setDeliveryStatus(e.target.value)}
                className="w-full border border-gray-400 text-gray-500 rounded-lg px-3 py-2 text-sm"
              >
                <option>Pending</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Date & Time*
              </label>
              <input
                required
                type="datetime-local"
                value={date}
                onChange={(e) => setdate(e.target.value)}
                className="w-full border border-gray-400 text-gray-500 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes about this payment"
                className="w-full border border-gray-400 rounded-md px-3 py-2 text-sm h-24"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="border border-gray-400 lg:w-1/2 rounded-2xl p-6">
          <h2 className="text-lg font-medium mb-4">Status Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm mb-2 font-medium">Payment Status</p>{" "}
              <span className="px-3 py-1 mt-4 text-xs rounded-full border border-orange-400 bg-orange-100 text-orange-600">
                <FontAwesomeIcon icon={faClock} className="pr-2" /> Pending{" "}
              </span>
            </div>
            <div>
              <p className="text-sm mb-2 font-medium">Delivery Status</p>
              <span className="px-3 py-1 text-xs rounded-full border border-blue-600 bg-blue-100 text-blue-600">
                Shipped
              </span>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <hr className="text-gray-400" />
        <div className="flex flex-col md:flex-row justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/Payments")}
            className="w-full md:w-auto flex items-center justify-center border border-red-600 gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-md font-medium hover:bg-red-200"
          >
            <FontAwesomeIcon icon={faXmark} />
            Discard Payment
          </button>
          <button
            type="submit"
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#02B978] text-white px-4 py-2 rounded-md font-medium hover:bg-[#04D18C]"
          >
            <FontAwesomeIcon icon={faCreditCard} />
            Create Payment
          </button>
        </div>
      </form>

    </div>
  );
}






// product data table backup code
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faTrash,
  faChevronLeft,
  faChevronRight,
  faAngleRight,
  faBoxArchive,
  faCircleCheck,
  faChartLine,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function ProductTable() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("all");
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");

  const rowsPerPage = 7;

  const getImageUrl = (img) => {
    if (!img) return "/placeholder-image.png";
    return img.startsWith("http")
      ? img
      : `https://la-dolce-vita.onrender.com${img}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://la-dolce-vita.onrender.com/api/product/product-list"
        );
        if (res.data && res.data.data) {
          setProducts(res.data.data);
        } else {
          setError("Failed to fetch products");
        }
      } catch (err) {
        setError("Error fetching products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 🔸 Filter by tab (status)
  let filteredProducts = [...products];
  if (activeTab === "active") {
    filteredProducts = filteredProducts.filter((p) => p.status === "active");
  } else if (activeTab === "archived") {
    filteredProducts = filteredProducts.filter((p) => p.status === "inactive");
  }

  // 🔸 Search
  if (search.trim()) {
    const term = search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        (p.productName && p.productName.toLowerCase().includes(term)) ||
        (p.productCode && p.productCode.toLowerCase().includes(term)) ||
        (p.category && p.category.toLowerCase().includes(term)) ||
        (p._id && p._id.toLowerCase().includes(term))
    );
  }

  // 🔸 Category filter
  filteredProducts =
    selectedCategory === "All"
      ? filteredProducts
      : filteredProducts.filter((p) => p.category === selectedCategory);

  // 🔸 Sort
  filteredProducts =
    sortOrder === "asc"
      ? [...filteredProducts].sort((a, b) =>
          (a.productName || "").localeCompare(b.productName || "")
        )
      : [...filteredProducts].sort((a, b) =>
          (b.productName || "").localeCompare(a.productName || "")
        );

  // 🔸 Pagination
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  // 🔸 Selection
  const toggleSelectAll = (e) => {
    if (e.target.checked) setSelected(currentProducts.map((p) => p._id));
    else setSelected([]);
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const allSelected =
    currentProducts.length > 0 &&
    currentProducts.every((p) => selected.includes(p._id));

  return (
    <div>
      {/* Tabs */}
      <div className="flex justify-between items-center border-2 border-gray-300 px-6 mt-5 rounded-md p-2 mx-6">
        <div className="flex gap-6">
          <button
            onClick={() => {
              setActiveTab("all");
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 text-sm px-2 pb-1 ${
              activeTab === "all"
                ? "text-black font-medium border-b-2 border-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <FontAwesomeIcon icon={faCircleCheck} /> All
          </button>
          <button
            onClick={() => {
              setActiveTab("active");
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 text-sm px-2 pb-1 ${
              activeTab === "active"
                ? "text-black font-medium border-b-2 border-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <FontAwesomeIcon icon={faChartLine} /> Active
          </button>
          <button
            onClick={() => {
              setActiveTab("archived");
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 text-sm px-2 pb-1 ${
              activeTab === "archived"
                ? "text-black font-medium border-b-2 border-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <FontAwesomeIcon icon={faBoxArchive} /> Inactive
          </button>
        </div>

        {/* Sort & Filter UI remains unchanged */}
         <div className="flex gap-2 relative">
                  {/* Filter Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowFilter((prev) => !prev)}
                      className="flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-900 hover:bg-gray-100 transition"
                    >
                      Filter
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className="ml-1 text-gray-600"
                      />
                    </button>
                    {showFilter && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-md z-50">
                        {["All", "Clothing", "Shoes", "Accessories"].map((cat) => (
                          <div
                            key={cat}
                            onClick={() => {
                              setSelectedCategory(cat);
                              setCurrentPage(1);
                              setShowFilter(false);
                            }}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          >
                            {cat}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
        
                  {/* Sort Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSort((prev) => !prev)}
                      className="flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-900 hover:bg-gray-100 transition"
                    >
                      Sort
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className="ml-1 text-gray-600"
                      />
                    </button>
                    {showSort && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-md z-50">
                        <div
                          onClick={() => {
                            setSortOrder("asc");
                            setShowSort(false);
                          }}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          A → Z
                        </div>
                        <div
                          onClick={() => {
                            setSortOrder("desc");
                            setShowSort(false);
                          }}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          Z → A
                        </div>
                      </div>
                    )}
                  </div>
                </div>
      </div>

      {/* Search bar */}
      <div className="flex gap-2 mx-6 relative mt-5">
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute left-3 top-3 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center py-6">Loading products...</p>
      ) : error ? (
        <p className="text-center py-6 text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto border-gray-400 rounded-lg shadow bg-white mx-6 mt-5">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs border-b">
              <tr>
                <th className="p-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                  />
                </th>
                <th className="p-3">Image</th>
                <th className="p-3">Product Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Category</th>
                <th className="p-3">Product Code</th>
                <th className="p-3">Size</th>
                <th className="p-3">Color</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((item) => (
                <tr
                  key={item._id}
                  className={`border-b hover:bg-gray-50 transition-colors ${
                    selected.includes(item._id) ? "bg-gray-50" : ""
                  }`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(item._id)}
                      onChange={() => toggleSelect(item._id)}
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                    />
                  </td>
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={getImageUrl(item.images?.[0])}
                      alt={item.productName}
                      className="w-10 h-10 rounded-md object-cover border"
                    />
                  </td>
                  <td className="p-3">{item.productName}</td>
                  <td className="p-3">{item.price}</td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3">{item.productCode}</td>
                  <td className="p-3">{item.size}</td>
                  <td className="p-3">{item.color}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === "active"
                          ? "bg-green-100 text-green-600 border border-green-400"
                          : "bg-red-100 text-red-600 border border-red-400"
                      }`}
                    >
                      {item.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3 flex gap-4 justify-center">
                    <button
                      onClick={() => navigate(`/user/view-product/${item._id}`)}
                      className="text-gray-600 hover:text-black"
                    >
                      <FontAwesomeIcon icon={faAngleRight} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center p-3 text-sm text-gray-600 bg-gray-50 border-t">
            <span className="text-gray-500">
              Showing {startIndex + 1}–
              {Math.min(startIndex + rowsPerPage, filteredProducts.length)} of{" "}
              {filteredProducts.length}
            </span>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded flex items-center gap-1 ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                <FontAwesomeIcon icon={faChevronLeft} /> Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border rounded flex items-center gap-1 ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                Next <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



// update event component code 
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../Components/Navbar";
import axios from "axios";

function UpdateEvent() {
  const { eventId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  // Pre-fill with state if available, otherwise empty
  const [eventDetails, setEventDetails] = useState({
    eventName: "",
    eventDescription: "",
    sessionID: "",
    status: "Inactive",
    startDateTime: "",
    endDateTime: "",
    eventLink: "",
  });

  const [hostInfo, setHostInfo] = useState({
    hostName: "",
    hostEmailAddress: "",
    hostPhoneNumber: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (state?.event) {
      const data = state.event;

      setEventDetails({
        eventName: data.eventDetails?.eventName || "",
        eventDescription: data.eventDetails?.eventDescription || "",
        sessionID: data.eventDetails?.sessionID || "",
        status: data.eventDetails?.status || "inactive",
        startDateTime: data.eventDetails?.startDateTime
          ? data.eventDetails.startDateTime.slice(0, 16)
          : "",
        endDateTime: data.eventDetails?.endDateTime
          ? data.eventDetails.endDateTime.slice(0, 16)
          : "",
        eventLink: data.eventDetails?.eventLink || "",
      });

      setHostInfo({
        hostName: data.hostInformation?.hostName || "",
        hostEmailAddress: data.hostInformation?.hostEmailAddress || "",
        hostPhoneNumber: data.hostInformation?.hostPhoneNumber || "",
      });
    }
  }, [state]);

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleHostChange = (e) => {
    const { name, value } = e.target;
    setHostInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventDetails.eventLink);
    alert("TikTok live event link copied to clipboard!");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        eventDetails,
        hostInformation: hostInfo,
      };

      const response = await axios.put(
        `https://la-dolce-vita.onrender.com/api/event/update-event/${eventId}`,
        payload
      );

      if (response.data.success) {
        alert(response.data.message);
        navigate("/user/tiktok"); // navigate back to list
      } else {
        alert("Failed to update event.");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar heading="TikTok Live Event Management" />

      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Update Event Details</h1>
        <button
          onClick={() => navigate("/user/tiktok")}
          className="mr-20 px-3 py-1 border border-red-700 text-red-700 bg-red-50 rounded-md hover:bg-gray-100"
        >
          <FontAwesomeIcon icon={faXmark} size="lg" className="text-red-700 px-2" />
          Discard
        </button>
      </div>

      <div className="max-w-6xl mb-10 mx-5 p-4 space-y-8">
        <form onSubmit={handleUpdate}>
          {/* Event Details */}
          <section className="border border-gray-400 rounded-2xl p-6 space-y-6">
            <h2 className="text-xl font-semibold">Event Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["eventName", "eventDescription", "sessionID", "status", "startDateTime", "endDateTime", "eventLink"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1">
                    {field === "eventName" && "Event Name"}
                    {field === "eventDescription" && "Event Description"}
                    {field === "sessionID" && "Session ID"}
                    {field === "status" && "Status"}
                    {field === "startDateTime" && "Start Date & Time"}
                    {field === "endDateTime" && "End Date & Time"}
                    {field === "eventLink" && "TikTok Live Event Link"}
                  </label>
                  {field === "status" ? (
                    <select
                      required
                      name="status"
                      value={eventDetails.status}
                      onChange={handleEventChange}
                      className="w-full border border-gray-400 rounded-md px-3 py-2"
                    >
                      <option value="inactive">Inactive</option>
                      <option value="active">Active</option>
                      <option value="about to come">About to come</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  ) : field === "eventLink" ? (
                    <div className="flex items-center border border-gray-400 rounded-md px-3 py-2">
                      <input
                        required
                        type="text"
                        name="eventLink"
                        value={eventDetails.eventLink}
                        onChange={handleEventChange}
                        className="flex-grow focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="ml-2 text-gray-600 hover:text-gray-900"
                      >
                        <FontAwesomeIcon icon={faClipboard} />
                      </button>
                    </div>
                  ) : (
                    <input
                      required
                      type={field.includes("DateTime") ? "datetime-local" : "text"}
                      name={field}
                      value={eventDetails[field]}
                      onChange={handleEventChange}
                      className="w-full border border-gray-400 rounded-md px-3 py-2"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Host Information */}
          <section className="border border-gray-400 rounded-2xl p-6 mt-10 space-y-4">
            <h2 className="text-xl font-semibold">Host Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["hostName", "hostEmailAddress", "hostPhoneNumber"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1">
                    {field === "hostName" && "Host Name*"}
                    {field === "hostEmailAddress" && "Email Address*"}
                    {field === "hostPhoneNumber" && "Phone Number"}
                  </label>
                  <input
                    required={field !== "hostPhoneNumber"}
                    type={field === "hostEmailAddress" ? "email" : "text"}
                    name={field}
                    value={hostInfo[field]}
                    onChange={handleHostChange}
                    className="w-full border border-gray-400 rounded-md px-3 py-2"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Save Button */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#114E9D] text-white px-6 py-2 rounded-lg hover:bg-blue-500"
            >
              {loading ? "Updating..." : "Update Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateEvent;