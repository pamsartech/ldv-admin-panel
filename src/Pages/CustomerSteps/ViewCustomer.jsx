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

/* -------------------- Shared Components -------------------- */

const STATUS_STYLES = {
  active: "text-green-700 bg-green-100 border-green-700",
  inactive: "text-gray-600 bg-gray-100 border-gray-600",
};

const StatusBadge = ({ status }) => {
  const normalized = status?.toLowerCase();
  const classes = STATUS_STYLES[normalized] || STATUS_STYLES.inactive;
  return (
    <span className={`text-xs font-semibold px-3 py-2 rounded-full border ${classes}`}>
      {status}
    </span>
  );
};

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
  default: "bg-white text-gray-700 border-gray-400 pr-10  hover:bg-gray-100",
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
        const response = await axios.get(`https://la-dolce-vita.onrender.com/api/user/user-details/${customerId}`);
        const data = response.data.data;

        // Map API data to component state
        setCustomer({
          name: data.customerName,
          email: data.email,
          status: data.isActive ? "Active" : "Inactive",
          CustomerID: data.accountDetails?.customerID || "-",
          totalSpend: data.accountDetails?.totalSpent || 0,
          totalOrders: data.accountDetails?.totalOrders || 0,
          preferences: {
            emailMarketing: data.communicationMethod === "email",
            smsMarketing: data.communicationMethod === "sms",
          },
          dateJoined: data.createdAt,
          lastLogin: data.updatedAt,
          address: data.address,
          phone: data.phoneno,
          dob: data.dob,
        });

        // Orders not included in this API
        setOrders([]);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (customerId) fetchCustomer();
  }, [customerId]);

    // -------------------- DELETE API --------------------
  const handleDeleteCustomer = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      const response = await axios.delete(`https://la-dolce-vita.onrender.com/api/user/delete-customer/${customerId}`, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        alert("Customer deleted successfully!");
        navigate("/Customers");
      } else {
        alert(`Failed to delete customer: ${response.data.message || "Unknown error"}`);
      }
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelOrder = (id) => alert(`Cancel order with id: ${id}`);

  if (loading) return <p className="p-4">Loading customer data...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;
  if (!customer) return <p className="p-4">No customer data found.</p>;

  return (
    <div>
      <Navbar heading="Customer Management" />

      {/* Header Buttons */}
      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Customer Profile</h1>
        <div>

           <button
            onClick={handleDeleteCustomer}
            disabled={isDeleting}
            className={`px-3 py-1 border rounded-md ${
              isDeleting
                ? "bg-gray-300 text-gray-500"
                : "text-[#B21E1E] bg-red-50 hover:bg-red-100"
            }`}
          >
            <FontAwesomeIcon icon={faTrashCan} className="px-2" />
            {isDeleting ? "Deleting..." : "Delete customer"}
          </button>

          {/* <button onClick={() => navigate("/Customers")} className="px-3 py-1 border rounded-md text-[#B21E1E] bg-red-50 hover:bg-red-100">
            <FontAwesomeIcon icon={faTrashCan} className="px-2" /> Delete customer
          </button> */}

          <button onClick={() => navigate(`/update-customer/${customer._id}` , { state: customer })} className="mx-2 px-3 py-1 border rounded-md text-[#114E9D] bg-blue-50 hover:bg-blue-100">
            <FontAwesomeIcon icon={faArrowRotateLeft} className="px-2" /> Update
          </button>

          <button onClick={() => navigate("/Customers")} className="px-3 py-1 border rounded-md text-white bg-[#02B978] hover:bg-[#04D18C]">
            <FontAwesomeIcon icon={faArrowLeft} className="text-white px-2" /> Back to Main View
          </button>
        </div>
      </div>

      <div className="p-4 mx-auto space-y-6">
        {/* Profile Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:mx-4">
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

        {/* Orders Section */}
        <div className="border border-gray-400 rounded-2xl p-6 mx-4 lg:w-5xl">
          <h3 className="font-medium mb-4">Orders made by customer</h3>
          {orders.length === 0 ? (
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
                        <StatusBadge status={paymentStatus} />
                      </td>
                      <td className="py-2 px-3">
                        <StatusBadge status={deliveryStatus} />
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



