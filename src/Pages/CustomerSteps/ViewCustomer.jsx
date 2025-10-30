import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faBan,
  faTimes,
  faLocationDot,
  faArrowLeft,
  faTrashCan,
  faArrowRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Skeleton } from "@mui/material"; // ✅ Import Skeleton

/* -------------------- StatusBadge Component -------------------- */
const STATUS_STYLES = {
  payment: {
    paid: "text-green-700 bg-green-100 border-green-700",
    pending: "text-amber-700 bg-amber-100 border-amber-700",
    failed: "text-red-700 bg-red-100 border-red-700",
    default: "text-gray-600 bg-gray-100 border-gray-600",
  },
  delivery: {
    delivered: "text-green-700 bg-green-100 border-green-700",
    shipped: "text-blue-700 bg-blue-100 border-blue-700",
    "in transit": "text-amber-700 bg-amber-100 border-amber-700",
    cancelled: "text-red-700 bg-red-100 border-red-700",
    pending: "text-amber-700 bg-amber-100 border-amber-700",
    default: "text-gray-600 bg-gray-100 border-gray-600",
  },
  general: {
    active: "text-green-700 bg-green-100 border-green-700",
    inactive: "text-gray-600 bg-gray-100 border-gray-600",
  },
};

const StatusBadge = ({ status, type = "general" }) => {
  const normalized = status?.toLowerCase() || "";
  const styleSet = STATUS_STYLES[type] || STATUS_STYLES.general;
  const classes = styleSet[normalized] || styleSet.default;

  return (
    <span
      className={`text-xs font-semibold px-3 py-1.5 rounded-full border capitalize ${classes}`}
    >
      {status}
    </span>
  );
};

/* -------------------- ToggleSwitch & ActionButton -------------------- */
const ToggleSwitch = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm">{label}</span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#02B978] peer-focus:ring-4 peer-focus:ring-[#04D18C] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-400 after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
    </label>
  </div>
);

const BUTTON_VARIANTS = {
  danger: "bg-[#B21E1E] text-white border-red-600 pr-5 hover:bg-red-700",
  default: "bg-white text-gray-700 border-gray-400 pr-10 hover:bg-gray-100",
};

const ActionButton = ({ children, onClick, variant = "default" }) => {
  const baseClasses = "flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium border transition-colors";
  return <button onClick={onClick} className={`${baseClasses} ${BUTTON_VARIANTS[variant]}`}>{children}</button>;
};

/* -------------------- Main Component -------------------- */
const ViewCustomer = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();

  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(
          `https://dev-api.payonlive.com/api/user/user-details/${customerId}`
        );

        const result = response.data;
        if (!result.success) throw new Error(result.message || "API error");

        const user = result.data.user;
        const stats = result.data.statistics;
        const orders = result.data.allOrders || [];

        setCustomer({
          id: user._id,
          name: user.customerName,
          email: user.email,
          status: user.isActive ? "Active" : "Inactive",
          customerID: user._id,
          totalSpend: stats.totalSpent || 0,
          totalOrders: stats.totalOrders || 0,
          preferences: {
            emailMarketing: user.communicationMethod === "email",
            smsMarketing: user.communicationMethod === "sms",
          },
          dateJoined: user.dateJoined,
          lastLogin: user.lastUpdated,
          address: `${user.address?.street || ""}, ${user.address?.city || ""}, ${user.address?.state || ""}, ${user.address?.zipcode || ""}, ${user.address?.country || ""}`,
          phone: user.phoneNumber,
          dob: user.dob,
        });

        const mappedOrders = orders.map((order) => ({
          id: order.orderId,
          productName: order.items[0]?.productName || "Unknown",
          productImage:
            order.items[0]?.productDetails?.images?.[0] ||
            order.items[0]?.productImage ||
            "https://via.placeholder.com/80",
          paymentStatus: order.paymentStatus,
          deliveryStatus: order.shippingStatus,
          price: order.orderTotal,
        }));

        setOrders(mappedOrders);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    if (customerId) fetchCustomer();
  }, [customerId]);

  const handleDeleteCustomer = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
    if (!confirmDelete) return;
    try {
      setIsDeleting(true);
      const response = await axios.delete(`https://dev-api.payonlive.com/api/user/delete-customer/${customerId}`);
      if (response.status === 200) {
        alert("Customer deleted successfully!");
        navigate("/user/Customers");
      } else alert(`Failed to delete customer: ${response.data.message || "Unknown error"}`);
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelOrder = (id) => alert(`Cancel order with id: ${id}`);

  return (
    <div>
      <Navbar heading="Customer Management" />

      {/* Header Buttons */}
      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Customer Profile</h1>
        <div>
          {loading ? (
            <Skeleton variant="rectangular" width={200} height={36} animation="wave" />
          ) : (
            <>
              <button
                onClick={handleDeleteCustomer}
                disabled={isDeleting}
                className={`px-3 py-1 border rounded-md ${isDeleting ? "bg-gray-300 text-gray-500" : "text-[#B21E1E] bg-red-50 hover:bg-red-100"}`}
              >
                <FontAwesomeIcon icon={faTrashCan} className="px-2" />
                {isDeleting ? "Deleting..." : "Delete customer"}
              </button>

              <button onClick={() => navigate(`/user/update-customer/${customerId}` , { state: customer })} className="mx-2 px-3 py-1 border rounded-md text-[#114E9D] bg-blue-50 hover:bg-blue-100">
                <FontAwesomeIcon icon={faArrowRotateLeft} className="px-2" /> Update
              </button>
              
              <button onClick={() => navigate("/user/Customers")} className="px-3 py-1 border rounded-md text-white bg-[#02B978] hover:bg-[#04D18C]">
                <FontAwesomeIcon icon={faArrowLeft} className="text-white px-2" /> Back to Main View
              </button>
            </>
          )}
        </div>
      </div>

      <div className="p-4 mx-auto space-y-6">
        {/* Profile Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:mx-4">
            {[...Array(3)].map((_, idx) => (
              <Skeleton key={idx} variant="rectangular" width="100%" height={200} animation="wave" className="rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:mx-4">
            {/* Customer Card */}
            <div className="border border-gray-400 rounded-2xl p-6">
              <div className="flex flex-col items-center">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Customer Avatar" className="w-20 h-20 rounded-full object-cover mb-4" />
                <h2 className="font-medium text-lg">{customer.name}</h2>
                <p className="text-gray-900 text-sm mt-2 mb-4">{customer.email}</p>
                <hr className="w-full border-gray-400 mb-4" />

                <div className="w-full space-y-2 text-sm">
                  <div className="flex py-2 justify-between">
                    <span>Status :</span>
                    <StatusBadge status={customer.status} />
                  </div>
                  <div className="flex justify-between">
                    <span>Customer ID :</span>
                    <span className="font-mono">{customer.customerID}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Spend :</span>
                    <span>€ {customer.totalSpend}</span>
                  </div>
                  <div className="flex py-2 justify-between">
                    <span>Total Orders :</span>
                    <span>{customer.totalOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone :</span>
                    <span>{customer.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences & Info */}
            <div className="border border-gray-400 rounded-2xl p-6">
              <h3 className="font-medium mb-4">Preferences & Info</h3>
              <ToggleSwitch label="Email Marketing :" checked={customer.preferences?.emailMarketing} onChange={() => {}} />
              <ToggleSwitch label="SMS Marketing :" checked={customer.preferences?.smsMarketing} onChange={() => {}} />
              <div className="flex justify-between text-sm mb-1">
                <span>Date Joined :</span>
                <span>{new Date(customer.dateJoined).toLocaleDateString()}</span>
              </div>
              <div className="flex py-2 justify-between text-sm mb-4">
                <span>Last Login :</span>
                <span>{new Date(customer.lastLogin).toLocaleString()}</span>
              </div>

              <h4 className="font-medium mb-2">Quick Actions</h4>
              <div className="space-y-3 mt-3">
                <ActionButton onClick={() => alert("Add address clicked")}>
                  <FontAwesomeIcon icon={faLocationDot} /> Add address
                </ActionButton>
                <ActionButton onClick={() => alert("Send Email clicked")}>
                  <FontAwesomeIcon icon={faEnvelope} /> Send Email
                </ActionButton>
                <ActionButton variant="danger" onClick={() => alert("Block Customer clicked")}>
                  <FontAwesomeIcon icon={faBan} /> Block Customer
                </ActionButton>
              </div>
            </div>
          </div>
        )}

        {/* Orders Section */}
        <div className="border border-gray-400 rounded-2xl p-6 mx-4 lg:w-5xl">
          <h3 className="font-medium mb-4">Orders made by customer</h3>
          {loading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, idx) => (
                <Skeleton key={idx} variant="rectangular" width="100%" height={40} animation="wave" className="rounded-md" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <p className="text-gray-500">No orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr>
                    <th className="py-2 px-3 font-medium">Product Name</th>
                    <th className="py-2 px-3 font-medium">Payment Status</th>
                    <th className="py-2 px-3 font-medium">Delivery Status</th>
                    <th className="py-2 px-3 font-medium">Price</th>
                    <th className="py-2 px-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(({ id, productName, productImage, paymentStatus, deliveryStatus, price }) => (
                    <tr key={id} className="border-t border-gray-200">
                      <td className="py-2 px-3 flex items-center gap-3">
                        <img src={productImage} alt={productName} className="w-12 h-12 object-cover rounded-md" />
                        <span>{productName}</span>
                      </td>
                      <td className="py-2 px-3">
                        <StatusBadge status={paymentStatus} type="payment" />
                      </td>
                      <td className="py-2 px-3">
                        <StatusBadge status={deliveryStatus} type="delivery" />
                      </td>
                      <td className="py-2 px-3">{price}</td>
                      <td className="py-2 px-3">
                        <button onClick={() => handleCancelOrder(id)} className="flex items-center gap-1 text-red-600 border border-red-600 rounded-full px-3 py-1 text-sm hover:bg-red-600 hover:text-white transition">
                          <FontAwesomeIcon icon={faTimes} /> Cancel order
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCustomer;




