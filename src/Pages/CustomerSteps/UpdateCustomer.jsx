import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const UpdateCustomer = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const location = useLocation();

  const existingData = location.state || {};

  // --- Form State ---
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    dob: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "Italy",
  });

  const [isActive, setIsActive] = useState(true);
  const [communicationMethod, setCommunicationMethod] = useState("email");
  const [marketingPrefs, setMarketingPrefs] = useState({
    offers: false,
    newsletter: false,
  });

  const [loading, setLoading] = useState(true);

  // --- Pre-fill Form ---
  useEffect(() => {
    if (existingData.name) {
      // Fill from location.state
      setFormData({
        customerName: existingData.name || "",
        email: existingData.email || "",
        phone: existingData.phone || "",
        dob: existingData.dob || "",
        street: existingData.address?.street || "",
        city: existingData.address?.city || "",
        state: existingData.address?.state || "",
        zip: existingData.address?.zipcode || "",
        country: existingData.address?.country || "Italy",
      });
      setIsActive(existingData.status === "Active");
      setCommunicationMethod(existingData.communicationMethod || "email");
      setMarketingPrefs({
        offers: existingData.marketingPrefs?.offers || false,
        newsletter: existingData.marketingPrefs?.newsletter || false,
      });
      setLoading(false);
    } else {
      // Fetch from API if no state
      const fetchCustomer = async () => {
        try {
          const res = await axios.get(
            `https://la-dolce-vita.onrender.com/api/user/user-details/${customerId}`
          );
          const data = res.data.data;
          setFormData({
            customerName: data.name || "",
            email: data.email || "",
            phone: data.phoneno || "",
            dob: data.dob || "",
            street: data.address?.street || "",
            city: data.address?.city || "",
            state: data.address?.state || "",
            zip: data.address?.zipcode || "",
            country: data.address?.country || "Italy",
          });
          setIsActive(data.isActive);
          setCommunicationMethod(data.communicationMethod || "email");
          setMarketingPrefs({
            offers: data.marketingPrefs?.offers || false,
            newsletter: data.marketingPrefs?.newsletter || false,
          });
          setLoading(false);
        } catch (err) {
          console.error("Error fetching customer:", err);
          setLoading(false);
        }
      };
      fetchCustomer();
    }
  }, [customerId, existingData]);

  // --- Handle Input Change ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // --- Handle Marketing Preferences ---
  const handleMarketingChange = (field) => {
    setMarketingPrefs({ ...marketingPrefs, [field]: !marketingPrefs[field] });
  };

  // --- Handle Form Submit ---
  const handleSubmit = async (e) => {
  e.preventDefault();

  // Construct payload matching backend structure
  const payload = {
    customerName: formData.customerName,
    email: formData.email,
    phoneNumber: formData.phone, // mapping 'phone' -> 'phoneNumber'
    dob: formData.dob,
    address: {
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zipcode: formData.zip, // mapping 'zip' -> 'zipcode'
      country: formData.country,
    },
    isActive,
    communicationMethod,
    // Optional: only include password if user wants to update it
    // password: formData.password || undefined
  };

  try {
    const res = await axios.put(
      `https://la-dolce-vita.onrender.com/api/user/update-customer/${customerId}`,
      payload
    );

    console.log("✅ Customer updated:", res.data);
    alert("Customer updated successfully!");
    navigate("/Customers");
  } catch (err) {
    console.error("❌ Error updating customer:", err.response?.data || err.message);
    alert("Failed to update customer. Please check console for details.");
  }
};


  if (loading) return <p className="p-4">Loading customer data...</p>;

  return (
    <div>
      <Navbar heading="Customer Management" />

      {/* Discard Button */}
      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Update Customer Details</h1>
        <button
          onClick={() => navigate("/Customers")}
          className="px-3 py-1 border border-red-700 text-red-700 bg-red-50 rounded-md hover:bg-gray-100"
        >
          <FontAwesomeIcon icon={faXmark} size="lg" className="text-red-700 px-2" />
          Discard
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-6xl mx-6 p-6 space-y-8 font-sans text-gray-700">
        {/* Basic Info */}
        <section className="border border-gray-400 rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-semibold">Basic Information</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">Status</span>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${isActive ? "bg-green-400" : "bg-gray-300"}`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isActive ? "translate-x-6" : ""}`}></div>
            </button>
            <span className={`text-sm font-medium ${isActive ? "text-green-600" : "text-gray-500"}`}>
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium mb-1 text-gray-600">Customer Name</label>
              <input
                required
                id="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-600">Email Address</label>
              <input
                required
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="customer@email.com"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1 text-gray-600">Phone number</label>
              <input
                required
                id="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+122 2131 3212"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="dob" className="block text-sm font-medium mb-1 text-gray-600">Date of birth</label>
              <input
                required
                id="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
        </section>

        {/* Address */}
        <section className="border border-gray-400 rounded-lg p-6 space-y-4">
          <h3 className="text-md font-semibold">Address</h3>
          <div>
            <label htmlFor="street" className="block text-sm font-medium mb-1">Street address</label>
            <input
              required
              id="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="Enter street address"
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
              <input id="city" value={formData.city} onChange={handleChange} className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium mb-1">State</label>
              <input id="state" value={formData.state} onChange={handleChange} className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label htmlFor="zip" className="block text-sm font-medium mb-1">Zip Code</label>
              <input id="zip" type="text" value={formData.zip} onChange={handleChange} className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-1">Country</label>
              <select id="country" value={formData.country} onChange={handleChange} className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm bg-white">
                <option>Italy</option>
                <option>France</option>
                <option>Germany</option>
                <option>USA</option>
              </select>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="border border-gray-400 rounded-lg p-6 space-y-6">
          <h3 className="text-md font-semibold">Preferences</h3>
          <div>
            <label htmlFor="preferredMethod" className="block text-sm font-medium mb-1">Preferred Communication Method</label>
            <select id="preferredMethod" value={communicationMethod} onChange={(e) => setCommunicationMethod(e.target.value)} className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm bg-white">
              <option>email</option>
              <option>phone</option>
              <option>sms</option>
            </select>
          </div>

          <fieldset className="text-sm">
            <h6 className="mb-2 font-medium">Marketing Preferences</h6>
            <label className="flex items-center gap-2 mb-2">
              <input type="checkbox" checked={marketingPrefs.offers} onChange={() => handleMarketingChange("offers")} />
              <span>Receive offers and promotions</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={marketingPrefs.newsletter} onChange={() => handleMarketingChange("newsletter")} />
              <span>Subscribe to newsletter</span>
            </label>
          </fieldset>
        </section>

        {/* Submit */}
        <hr className="text-gray-400" />
        <div className="flex justify-end">
          <button type="submit" className="bg-[#114E9D] text-white font-semibold rounded-lg px-5 py-2 text-sm hover:bg-blue-500">
            Update Customer
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCustomer;




