import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useAlert } from "../../Components/AlertContext";

const UpdateCustomer = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const { showAlert } = useAlert();

  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);

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

  // --- Fetch from API only ---
  useEffect(() => {
  const fetchCustomer = async () => {
    try {
      const res = await axios.get(
        `http://dev-api.payonlive.com/api/user/user-details/${customerId}`
      );

      const user = res.data?.data?.user || {};

      setFormData({
        customerName: user.customerName || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        dob: user.dob ? user.dob.split("T")[0] : "",
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        zip: user.address?.zipcode || "",
        country: user.address?.country || "Italy",
      });

      setIsActive(user.isActive ?? true);
      setCommunicationMethod(user.communicationMethod || "email");
      setMarketingPrefs({
        offers: user.marketingPrefs?.offers || false,
        newsletter: user.marketingPrefs?.newsletter || false,
      });

      setLoading(false);
    } catch (err) {
      console.error("❌ Error fetching customer:", err);
      showAlert("Failed to load customer data.", "error");
      setLoading(false);
    }
  };

  fetchCustomer();
}, [customerId, showAlert]);


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
    setBtnLoading(true);

    const payload = {
      customerName: formData.customerName,
      email: formData.email,
      phoneNumber: formData.phone,
      dob: formData.dob,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipcode: formData.zip,
        country: formData.country,
      },
      isActive,
      communicationMethod,
    };

    try {
      const res = await axios.put(
        `http://dev-api.payonlive.com/api/user/update-customer/${customerId}`,
        payload
      );

      console.log("✅ Customer updated:", res.data);
      showAlert("Customer updated successfully!", "success");
      navigate("/user/Customers");
    } catch (err) {
      console.error("❌ Error updating customer:", err);
      showAlert("Failed to update customer. Please try again.", "error");
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading)
    return (
      <p className="p-4 text-gray-600 animate-pulse">Loading customer data...</p>
    );

  return (
    <div>
      <Navbar heading="Customer Management" />

      {/* Header */}
      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Update Customer Details</h1>
        <button
          onClick={() => navigate("/user/Customers")}
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

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-6 p-6 space-y-8 font-sans text-gray-700"
      >
        {/* Basic Info */}
        <section className="border border-gray-400 rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-semibold">Basic Information</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">Status</span>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                isActive ? "bg-green-400" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  isActive ? "translate-x-6" : ""
                }`}
              ></div>
            </button>
            <span
              className={`text-sm font-medium ${
                isActive ? "text-green-600" : "text-gray-500"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="customerName"
                className="block text-sm font-medium mb-1 text-gray-600"
              >
                Customer Name
              </label>
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
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1 text-gray-600"
              >
                Email Address
              </label>
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
              <label
                htmlFor="phone"
                className="block text-sm font-medium mb-1 text-gray-600"
              >
                Phone number
              </label>
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
              <label
                htmlFor="dob"
                className="block text-sm font-medium mb-1 text-gray-600"
              >
                Date of birth
              </label>
              <input
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
            <label htmlFor="street" className="block text-sm font-medium mb-1">
              Street address
            </label>
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
              <label htmlFor="city" className="block text-sm font-medium mb-1">
                City
              </label>
              <input
                id="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium mb-1">
                State
              </label>
              <input
                id="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="zip" className="block text-sm font-medium mb-1">
                Zip Code
              </label>
              <input
                id="zip"
                type="text"
                value={formData.zip}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium mb-1"
              >
                Country
              </label>
              <select
                id="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm bg-white"
              >
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
            <label
              htmlFor="preferredMethod"
              className="block text-sm font-medium mb-1"
            >
              Preferred Communication Method
            </label>
            <select
              id="preferredMethod"
              value={communicationMethod}
              onChange={(e) => setCommunicationMethod(e.target.value)}
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option>email</option>
              <option>phone</option>
              <option>sms</option>
            </select>
          </div>

          <fieldset className="text-sm">
            <h6 className="mb-2 font-medium">Marketing Preferences</h6>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={marketingPrefs.offers}
                onChange={() => handleMarketingChange("offers")}
              />
              <span>Receive offers and promotions</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={marketingPrefs.newsletter}
                onChange={() => handleMarketingChange("newsletter")}
              />
              <span>Subscribe to newsletter</span>
            </label>
          </fieldset>
        </section>

        <hr className="text-gray-400" />

        {/* Submit Button */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={btnLoading}
            className="bg-[#114E9D] text-white px-6 py-2 rounded-lg hover:bg-blue-500 flex items-center gap-2"
          >
            {btnLoading && (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {btnLoading ? "Updating..." : "Update Customer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCustomer;
