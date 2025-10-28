import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRotateLeft,
  faTrashCan,
  faFileInvoice,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faTruck,
  faBoxOpen,
  faHourglassHalf,
  faCheckCircle,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

// 🧩 Material UI Skeleton
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function ViewOrder() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [orderStatus, setOrderStatus] = useState("Pending");

  // Fetch order details
  useEffect(() => {
    if (!orderId) {
      setError("Order ID is missing in the URL.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `http://dev-api.payonlive.com/api/order/order-details/${orderId}`
        );
        if (response.data.success && response.data.data) {
          setOrder(response.data.data);
          setOrderStatus(response.data.data.shippingStatus || "Pending");
        } else {
          setError(response.data.message || "Failed to fetch order.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // 🦴 Skeleton Loader UI
  if (loading) {
    return (
      <div>
        <Navbar heading="Order Management" />
        <div className="max-w-6xl mx-auto mt-10 bg-white rounded-lg shadow-sm p-6">
          <div className="lg:flex gap-6">
            {/* LEFT COLUMN SKELETON */}
            <div className="w-full lg:w-1/2 space-y-5">
              <Stack spacing={2}>
                <Skeleton variant="text" width={200} height={30} animation="wave" />
                <Skeleton variant="rectangular" height={100} animation="wave" />
                <Skeleton variant="text" width={160} height={25} animation="wave" />
                <Skeleton variant="rectangular" height={120} animation="wave" />
                <Skeleton variant="rectangular" height={150} animation="wave" />
              </Stack>
            </div>

            {/* RIGHT COLUMN SKELETON */}
            <div className="w-full lg:w-1/2 space-y-5">
              <Stack spacing={2}>
                <Skeleton variant="text" width={180} height={30} animation="wave" />
                <Skeleton variant="rectangular" height={100} animation="wave" />
                <Skeleton variant="text" width={150} height={25} animation="wave" />
                <Skeleton variant="rectangular" height={200} animation="wave" />
                <Skeleton variant="rectangular" height={180} animation="wave" />
              </Stack>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error)
    return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  if (!order) return null;

  // Delete order
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      const response = await axios.delete(
        `http://dev-api.payonlive.com/api/order/delete-order/${orderId}`
      );

      if (response.data.success) {
        alert("Order deleted successfully!");
        navigate("/user/Orders");
      } else {
        alert(
          `Failed to delete order: ${response.data.message || "Unknown error"}`
        );
      }
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // ✅ Main UI after data loads
  return (
    <div>
      <Navbar heading="Order Management" />

      {/* Top Buttons */}
      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">My Orders</h1>
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
            {isDeleting ? "Deleting..." : "Delete order"}
          </button>

          <button
            onClick={() =>
              navigate(`/user/update-order/${orderId}`, {
                state: { orderData: order },
              })
            }
            className="mx-2 px-3 py-1 border rounded-md text-[#114E9D] bg-blue-50 hover:bg-blue-100"
          >
            <FontAwesomeIcon icon={faArrowRotateLeft} className="px-2" />
            Update
          </button>

          <button
            onClick={() => navigate("/user/Orders")}
            className="px-3 py-1 border rounded-md text-white bg-[#02B978] hover:bg-[#04D18C]"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-white px-2" />
            Back to Main View
          </button>
        </div>
      </div>

      {/* Order Details */}
      <div className="max-w-6xl mx-5 mt-5 border-t bg-white border-gray-500 overflow-hidden">
        <div className="lg:flex">
          {/* LEFT COLUMN */}
          <div className="w-full lg:w-1/2">
            {/* Order ID Section */}
            <section className="p-6 border-b border-gray-500">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-medium text-lg">Order ID</h2>
                <span className="font-medium text-lg">#{order._id}</span>
              </div>

              <div className="text-sm space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span>Date</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Order amount</span>
                  <span>€{order.orderTotal}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Status</span>
                  <span>{orderStatus}</span>
                </div>
              </div>
            </section>

            {/* Payment Info */}
            <section className="p-6 border-b border-gray-500">
              <h3 className="font-medium mb-3">Payment Info</h3>
              <div className="text-sm text-gray-700 space-y-3">
                <div className="flex justify-between">
                  <span>Method</span>
                  <span>{order.paymentMethod}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Status</span>
                  <span className="inline-block bg-green-100 text-green-600 text-xs font-semibold rounded-full px-3 py-1">
                    {order.paymentStatus}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Transaction ID</span>
                  <div className="flex items-center gap-3">
                    {/* <FontAwesomeIcon
                      icon={faFileInvoice}
                      className="text-gray-600"
                    /> */}
                     <button className="ml-2 text-xs text-gray-500 hover:text-gray-700">
                      <FontAwesomeIcon icon={faCopy} />
                    </button>
                    <span className="truncate max-w-[160px]">
                      {order.payment_id || "N/A"}
                    </span>
                    {/* <button className="ml-2 text-xs text-gray-500 hover:text-gray-700">
                      <FontAwesomeIcon icon={faCopy} />
                    </button> */}
                  </div>
                </div>
              </div>
            </section>

            {/* TikTok Live Ref */}
            <section className="p-6 border-b border-gray-500">
              <h3 className="font-medium mb-3">TikTok Live Ref</h3>
              <div className="text-sm text-gray-700 space-y-2">
                <div className="flex justify-between">
                  <span>Session name</span>
                  <span>Clothing code</span>
                </div>
                <div className="flex justify-between">
                  <span>Session ID</span>
                  <span>13121232</span>
                </div>
              </div>
            </section>

            {/* Products sold */}
            <section className="p-6 border-t border-gray-500">
              <h3 className="font-medium mb-4">Products sold</h3>
              <div className="flex gap-6">
                <div className="space-y-3 w-1/2 text-sm text-gray-700">
                  {order.orderItems.map((item) => (
                    <div key={item._id} className="flex items-center gap-2">
                      <img
                        src={
                          item.productDetails?.images?.[0] ||
                          "/placeholder-image.png"
                        }
                        alt={item.productName}
                        className="w-12 h-12 rounded-md object-cover border bg-gray-100"
                      />

                      <div className="flex-1">
                        <div className="font-medium">{item.productName}</div>
                      </div>
                      <div className="text-sm">€{item.price}</div>
                    </div>
                  ))}
                </div>

                <div className="w-1/2 border-l border-gray-500 pl-6 text-sm text-gray-800">
                  <div className="flex justify-between mb-1">
                    <span>Subtotal :</span>
                    <span>
                      €
                      {order.orderItems.reduce(
                        (acc, item) => acc + item.total,
                        0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Shipping :</span>
                    <span>{order.shippingMethod || "Standard"}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total :</span>
                    <span>€{order.orderTotal}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="w-full lg:w-1/2 border-l border-gray-500">
            {/* Customer Info */}
            <section className="p-6 pb-7 border-b border-gray-500">
              <h3 className="font-medium text-lg mb-3 mx-10">Customer Info</h3>
              <div className="text-sm text-gray-700 mx-10 space-y-3">
                <div className="flex justify-between">
                  <span>Name</span>
                  <span className="font-medium">{order.customerName}</span>
                </div>

                <div className="flex justify-between items-start">
                  <span>Email</span>
                  <div className="flex items-center gap-3">
                    {/* <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-gray-600"
                    /> */}
                     <button className="ml-2 text-xs text-gray-500 hover:text-gray-700">
                      <FontAwesomeIcon icon={faCopy} />
                    </button>

                    <span className="truncate max-w-[220px]">
                      {order.email}
                    </span>
                    {/* <button className="ml-2 text-xs text-gray-500 hover:text-gray-700">
                      <FontAwesomeIcon icon={faCopy} />
                    </button> */}
                  </div>
                </div>

                <div className="flex justify-between items-start">
                  <span>Phone</span>
                  <div className="flex items-center gap-3">
                    {/* <FontAwesomeIcon icon={faPhone} className="text-gray-600" /> */}
                     <button className="ml-2 text-xs text-gray-500 hover:text-gray-700">
                      <FontAwesomeIcon icon={faCopy} />
                    </button>
                    <span className="truncate max-w-[220px]">
                      {order.phoneNumber}
                    </span>
                    
                  </div>
                </div>
              </div>
            </section>

            {/* Shipping Info */}
            <section className="p-6 mx-10">
              <h3 className="font-medium mb-3">Shipping Info</h3>
              <div className="flex items-start gap-3 text-sm text-gray-700">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="text-gray-600 mt-0.5"
                />
                <div>
                  <div className="mb-1">Shipping Address</div>
                  <div className="text-sm text-gray-600">{order.address}</div>
                </div>
              </div>
            </section>

            {/* Activity */}
            <section className="p-6 mx-10">
              <h3 className="font-medium mb-4">Activity</h3>
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-300" />

                <ul className="space-y-8">
                  {/* Shipped */}
                  <li className="relative">
                    <span className="absolute left-6 top-0 -translate-x-1/2 w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center shadow-sm">
                      <FontAwesomeIcon
                        icon={faTruck}
                        className="text-green-500"
                      />
                    </span>
                    <div className="pl-16">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">Shipped</h4>
                        <span className="text-xs text-gray-500">
                          2 hours ago
                        </span>
                      </div>
                      <div className="mt-2 inline-flex items-center gap-3 p-2 rounded-md border border-gray-500 bg-white">
                        <span className="text-xs text-gray-700">
                          Order No: 5220138384381
                        </span>
                        <button className="ml-3 text-xs text-blue-600 font-medium px-2 py-1 rounded border border-gray-500">
                          Track
                        </button>
                      </div>
                    </div>
                  </li>

                  {/* Email Sent */}
                  <li className="relative">
                    <span className="absolute left-6 top-0 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center shadow-sm">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="text-blue-600"
                      />
                    </span>
                    <div className="pl-16">
                      <h4 className="font-medium">Email Sent to customer</h4>
                      <p className="text-xs text-gray-500">August, 2025</p>
                      <div className="mt-2 p-3 border-gray-300 border rounded-md bg-gray-50 text-xs text-gray-700">
                        <p>Shipped Order No: 5220138384381</p>
                        <p>
                          Shiprocket: your order has been successfully shipped
                        </p>
                      </div>
                    </div>
                  </li>

                  {/* Order Packed */}
                  <li className="relative">
                    <span className="absolute left-6 top-0 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center shadow-sm">
                      <FontAwesomeIcon
                        icon={faBoxOpen}
                        className="text-gray-500"
                      />
                    </span>
                    <div className="pl-16">
                      <h4 className="font-medium">Order Packed</h4>
                      <p className="text-xs text-gray-500">August 5, 2025</p>
                    </div>
                  </li>

                  {/* Processing */}
                  <li className="relative">
                    <span className="absolute left-6 top-0 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center shadow-sm">
                      <FontAwesomeIcon
                        icon={faHourglassHalf}
                        className="text-gray-400"
                      />
                    </span>
                    <div className="pl-16">
                      <h4 className="font-medium">Processing</h4>
                      <p className="text-xs text-gray-500">August 5, 2025</p>
                    </div>
                  </li>

                  {/* Order Placed */}
                  <li className="relative">
                    <span className="absolute left-6 top-0 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center shadow-sm">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-gray-400"
                      />
                    </span>
                    <div className="pl-16">
                      <h4 className="font-medium">Order placed</h4>
                      <p className="text-xs text-gray-500">August 2, 2025</p>
                    </div>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
