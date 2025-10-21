import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const CreateCustomer = () => {
  const navigate = useNavigate();

  // 🟢 State for basic info & address
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phoneNumber: "",
    dob: "",
    password: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "Italy",
  });

  const [statusActive, setStatusActive] = useState(true);
  const [communicationMethod, setCommunicationMethod] = useState("email");
  const [marketingPrefs, setMarketingPrefs] = useState({
    offers: false,
    newsletter: false,
  });

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // toggle marketing preferences
  const handleMarketingChange = (field) => {
    setMarketingPrefs({ ...marketingPrefs, [field]: !marketingPrefs[field] });
  };

  // submit handler
  const handleSubmit = async (e) => {
  e.preventDefault();

  // Construct payload matching backend API
  const payload = {
    customerName: formData.customerName,
    email: formData.email,
    phoneNumber: String(formData.phoneNumber), // ensure string
    dob: formData.dob,
    password: formData.password,
    address: {
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zipcode: String(formData.zipcode), // ensure string
      country: formData.country,
    },
    isActive: statusActive,
    communicationMethod: communicationMethod.toLowerCase(),
  };

  try {
    const res = await axios.post(
      "http://dev-api.payonlive.com/api/user/create-customer",
      payload
    );

    console.log("✅ Customer created:", res.data);
    alert("Customer created successfully!");
    navigate("/user/Customers"); // redirect after save
  } catch (err) {
    console.error("❌ Error creating customer:", err.response?.data || err.message);
    alert("Failed to create customer. Please check the console for details.");
  }
};


  return (
    <div>
      <Navbar heading="Customer Management" />

      {/* discard button */}
      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Add New Customer</h1>
        <button
          onClick={() => navigate("/user/Customers")}
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

      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-6 p-6 space-y-8 font-sans text-gray-700"
      >
        {/* Basic Information */}
        <section className="border border-gray-400 rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-semibold">Basic Information</h2>

          {/* Status toggle */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">Status</span>
            <button
              type="button"
              onClick={() => setStatusActive(!statusActive)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                statusActive ? "bg-green-400" : "bg-gray-300"
              }`}
              aria-label="Toggle status"
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  statusActive ? "translate-x-6" : ""
                }`}
              ></div>
            </button>
            <span
              className={`text-sm font-medium ${
                statusActive ? "text-green-600" : "text-gray-500"
              }`}
            >
              {statusActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Inputs */}
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
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
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
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
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
                id="phoneNumber"
                type="number"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+122 2131 3212"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
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
                required
                id="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                placeholder="dd-mm-yyyy"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              />
            </div>
            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-medium mb-1 text-gray-600"
              >
                Password
              </label>
              <input
                required
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="enter password"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              />
            </div>
          </div>
        </section>

        {/* Address */}
        <section className="border border-gray-400 rounded-lg p-6 space-y-4">
          <h3 className="text-md font-semibold">Address</h3>
          <div>
            <label
              htmlFor="street"
              className="block text-sm font-medium mb-1 text-gray-600"
            >
              Street address
            </label>
            <input
              required
              id="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="Enter street address"
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium mb-1 text-gray-600"
              >
                City
              </label>
              <input
                required
                id="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter City"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              />
            </div>
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium mb-1 text-gray-600"
              >
                State
              </label>
              <input
                required
                id="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter State"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              />
            </div>
            <div>
              <label
                htmlFor="zip"
                className="block text-sm font-medium mb-1 text-gray-600"
              >
                Zip Code
              </label>
              <input
                required
                id="zipcode"
                type="number"
                value={formData.zipcode}
                onChange={handleChange}
                placeholder="Enter zip code"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              />
            </div>
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium mb-1 text-gray-600"
              >
                Country
              </label>
              <select
                required
                id="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="border border-gray-400 rounded-lg p-6 col-span-2 space-y-6">
            <h3 className="text-md font-semibold">Preferences</h3>
            <div>
              <label
                htmlFor="preferredMethod"
                className="block text-sm font-medium mb-1 text-gray-600"
              >
                Preferred Communication Method
              </label>
              <select
                required
                id="communicationMethod"
                value={communicationMethod}
                onChange={(e) => setCommunicationMethod(e.target.value)}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option>email</option>
                <option>phone</option>
                <option>sms</option>
              </select>
            </div>

            <fieldset className="text-sm text-gray-700">
              <h6 className="mb-2 font-medium">Marketing Preferences</h6>

              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={marketingPrefs.offers}
                  onChange={() => handleMarketingChange("offers")}
                  className="form-checkbox rounded border-gray-400"
                />
                <span>Receive offers and promotions</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={marketingPrefs.newsletter}
                  onChange={() => handleMarketingChange("newsletter")}
                  className="form-checkbox rounded border-gray-400"
                />
                <span>Subscribe to newsletter</span>
              </label>
            </fieldset>
          </section>

          {/* Profile Preview */}

          <section className="border border-gray-400 rounded-lg p-6">
            <h3 className="text-md font-semibold mb-4">
              New Customer Profile Preview
            </h3>
            <div className="flex flex-col items-center space-y-2">
              <img
                src="https://randomuser.me/api/portraits/women/68.jpg"
                alt="Customer"
                className="w-20 h-20 rounded-full object-cover"
              />
              <p className="text-sm font-semibold">Customer Name</p>
              <p className="text-xs text-gray-500">email@example.com</p>
            </div>
            <hr className="text-gray-400 mt-4" />
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span>Status :</span>{" "}
                <span
                  className={`text-xs font-semibold rounded-full px-3 py-1 ${
                    statusActive
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {statusActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Customer ID :</span>{" "}
                <span className="font-mono text-xs">CSOAKFLKSNKJA</span>
              </div>
              <div className="flex justify-between">
                <span>Total Spend :</span> <span>€ 0</span>
              </div>
              <div className="flex justify-between">
                <span>Total Orders :</span> <span>0</span>
              </div>
            </div>
          </section>

          {/* <section className="border border-gray-400 rounded-lg p-6">
            <h3 className="text-md font-semibold mb-4">New Customer Profile Preview</h3>
            <div className="flex flex-col items-center space-y-2">
              <img
                src="https://randomuser.me/api/portraits/women/68.jpg"
                alt="Customer"
                className="w-20 h-20 rounded-full object-cover"
              />
              <p className="text-sm font-semibold">
                {formData.customerName || "Customer Name"}
              </p>
              <p className="text-xs text-gray-500">
                {formData.email || "email@example.com"}
              </p>
            </div>
          </section> */}
        </div>

        {/* Save Button */}
        <hr className="text-gray-400" />
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-600 text-white font-semibold rounded-lg px-5 py-2 text-sm hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCustomer;

