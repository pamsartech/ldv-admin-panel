import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useAlert } from "../../Components/AlertContext";

const CreateCustomer = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);

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
  const [errors, setErrors] = useState({});

  // 🟢 Validation rules
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "customerName":
        if (!value.trim()) error = "Name is required";
        else if (value.length < 2) error = "Name must be at least 2 characters";
        break;

      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(value))
          error = "Please enter a valid email address";
        break;

      case "phoneNumber":
        if (!value.trim()) error = "Phone number is required";
        else if (!/^\d{9,15}$/.test(value))
          error = "Phone number must be 9–15 digits";
        break;

      case "password":
        if (!value.trim()) error = "Password is required";
        else if (value.length < 6)
          error = "Password must be at least 6 characters";
        break;

      case "city":
        if (!value.trim()) error = "City is required";
        break;
      case "street":
        if (!value.trim()) error = "Street address is required";
        break;
      case "state":
        if (!value.trim()) error = "State is required";
        break;
      case "zipcode":
        if (!value.trim()) error = "Zip code is required";
        else if (!/^\d{5,6}$/.test(value.trim()))
          error = "Zip code must be 5 or 6 digits";
        break;
      case "country":
        if (!value.trim()) error = "Please select the Country";
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  // handle input change
  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === "dob") {
      // Check if the user entered a valid date and the year is 4 digits
      const year = value.split("-")[0];
      if (year && year.length > 4) {
        // alert("Year cannot be more than 4 digits");
        return; // Stop updating the state
      }
    }

    setFormData((prev) => ({ ...prev, [id]: value }));

    // live validate
    validateField(id, value);
  };

  // toggle marketing preferences
  const handleMarketingChange = (field) => {
    setMarketingPrefs({ ...marketingPrefs, [field]: !marketingPrefs[field] });
  };

  // 🟠 Validate all before submit
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showAlert("Please fix the validation errors.", "error");
      return;
    }

    setLoading(true);

    // // ✅ Basic validation (optional)
    // if (
    //   !formData.customerName ||
    //   !formData.email ||
    //   !formData.phoneNumber ||
    //   !formData.password
    // ) {
    //   showAlert("Please fill in all required fields.", "error");
    //   setLoading(false); // stop spinner if validation fails
    //   return;
    // }

    // ✅ Construct payload
    const payload = {
      customerName: formData.customerName.trim(),
      email: formData.email.trim(),
      phoneNumber: String(formData.phoneNumber),
      dob: formData.dob,
      password: formData.password,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipcode: String(formData.zipcode),
        country: formData.country,
      },
      isActive: statusActive,
      communicationMethod: communicationMethod.toLowerCase(),
    };

    try {
      const res = await axios.post(
        "https://dev-api.payonlive.com/api/user/create-customer",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("✅ Customer created:", res.data);

      if (res.data?.success || res.status === 200) {
        showAlert("Customer created successfully!", "success");
        navigate("/user/Customers");
      } else {
        showAlert("Failed to create customer. Please try again.", "error");
      }
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Server error. Please try again.";
      showAlert(message, "info");
    } finally {
      // ✅ Always stop spinner no matter what
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar heading="Gestion des clients" />

      {/* discard button */}
      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Ajouter un nouveau client</h1>
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

      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-6 p-6 space-y-8 font-sans text-gray-700"
      >
        {/* Basic Information */}
        <section className="border border-gray-400 rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-semibold">Informations de base</h2>

          {/* Status toggle */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">Statut</span>
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
              {statusActive ? "Actif" : "Inactif"}
            </span>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="customerName"
                className="block text-sm font-medium mb-1 text-gray-600"
              >
                Nom du client
              </label>
              <input
                id="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Nom complet"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              />
              {errors.customerName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.customerName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1 text-gray-600"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="client@email.com"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium mb-1 text-gray-600"
              >
                Numéro de téléphone
              </label>
              <input
                id="phoneNumber"
                type="number"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+122 2131 3212"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              />
              {errors.phoneNumber && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-medium mb-1 text-gray-600"
              >
                Date de naissance
              </label>
              <input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                placeholder="dd-mm-yyyy"
                min="1800-01-01" max="3500-12-31"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-medium mb-1 text-gray-600"
              >
               Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Saisissez le mot de passe"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>
          </div>
        </section>

        {/* Address */}
        <section className="border border-gray-400 rounded-lg p-6 space-y-4">
          <h3 className="text-md font-semibold">Adresse</h3>
          <div>
            <label
              htmlFor="street"
              className="block text-sm font-medium mb-1 text-gray-600"
            >
              Adresse de la rue
            </label>
            <input
              id="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="Saisissez le Adresse de la rue"
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
            />
            {errors.street && (
              <p className="text-xs text-red-500 mt-1">{errors.street}</p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium mb-1 text-gray-600"
              >
                Ville
              </label>
              <input
                id="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Saisissez le Ville"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              />
              {errors.city && (
                <p className="text-xs text-red-500 mt-1">{errors.city}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium mb-1 text-gray-600"
              >
                État
              </label>
              <input
                id="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Saisissez le État"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              />
              {errors.state && (
                <p className="text-xs text-red-500 mt-1">{errors.state}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="zip"
                className="block text-sm font-medium mb-1 text-gray-600"
              >
                Code postal
              </label>
              <input
                id="zipcode"
                type="number"
                value={formData.zipcode}
                onChange={handleChange}
                placeholder="Saisissez le Code postal"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              />
              {errors.zipcode && (
                <p className="text-xs text-red-500 mt-1">{errors.zipcode}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium mb-1 text-gray-600"
              >
                Pays
              </label>
              <select
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
              {errors.country && (
                <p className="text-xs text-red-500 mt-1">{errors.country}</p>
              )}
            </div>
          </div>
        </section>

        {/* Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="border border-gray-400 rounded-lg p-6 col-span-2 space-y-6">
            <h3 className="text-md font-semibold">Préférences</h3>
            <div>
              <label
                htmlFor="preferredMethod"
                className="block text-sm font-medium mb-1 text-gray-600"
              >
                Méthode de communication préférée
              </label>
              <select
                id="communicationMethod"
                value={communicationMethod}
                onChange={(e) => setCommunicationMethod(e.target.value)}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option>e-mail</option>
                <option>phone</option>
                <option>sms</option>
              </select>
            </div>

            <fieldset className="text-sm text-gray-700">
              <h6 className="mb-2 font-medium">Préférences marketing</h6>

              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={marketingPrefs.offers}
                  onChange={() => handleMarketingChange("offers")}
                  className="form-checkbox rounded border-gray-400"
                />
                <span>Recevez des offres et des promotions</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={marketingPrefs.newsletter}
                  onChange={() => handleMarketingChange("newsletter")}
                  className="form-checkbox rounded border-gray-400"
                />
                <span>Abonnez-vous à la newsletter</span>
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
              <p className="text-sm font-semibold">New Customer Profile Preview</p>
              <p className="text-xs text-gray-500">email@example.com</p>
            </div>
            <hr className="text-gray-400 mt-4" />
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span>Statut :</span>{" "}
                <span
                  className={`text-xs font-semibold rounded-full px-3 py-1 ${
                    statusActive
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {statusActive ? "Actif" : "Inactif"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>ID client:</span>{" "}
                <span className="font-mono text-xs">CSOAKFLKSNKJA</span>
              </div>
              <div className="flex justify-between">
                <span>Dépenses totales :</span> <span>€ 0</span>
              </div>
              <div className="flex justify-between">
                <span>Commandes totales :</span> <span>0</span>
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
        {/* <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-600 text-white font-semibold rounded-lg px-5 py-2 text-sm hover:bg-green-700"
          >
            Save
          </button>
        </div> */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#02B978] text-white px-6 py-2 rounded-lg hover:bg-[#04D18C] flex items-center gap-2"
          >
            {loading && (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCustomer;
