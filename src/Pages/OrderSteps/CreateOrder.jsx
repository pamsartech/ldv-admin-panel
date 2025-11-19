// --- existing imports ---
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
      newErrors.customerName = "Le nom du client est requis.";
    if (!email.trim()) newErrors.email = "E-mail est requis.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Veuillez entrer une adresse e-mail valide.";

    if (!phoneNumber.trim())
      newErrors.phoneNumber = "Le numéro de téléphone est requis.";
    else if (!/^\d{9,15}$/.test(phoneNumber))
      newErrors.phoneNumber =
        "Le numéro de téléphone doit contenir entre 9 et 15 chiffres.";

    if (!address.trim())
      newErrors.address = "L’adresse de livraison est requise.";

    if (!paymentMethod.trim())
      newErrors.paymentMethod = "Veuillez sélectionner un mode de paiement.";
    if (!paymentStatus.trim())
      newErrors.paymentStatus = "Veuillez sélectionner un statut de paiement.";
    if (!shippingMethod.trim())
      newErrors.shippingMethod = "Choisissez un mode de livraison.";
    if (!shippingStatus.trim())
      newErrors.shippingStatus = "Sélectionnez un statut d'expédition.";

    // Validate order items
    orderItems.forEach((item, idx) => {
      if (!item.productName.trim())
        newErrors[`product_${idx}`] = `Le code produit est requis.`;
      if (item.price <= 0)
        newErrors[
          `price_${idx}`
        ] = `Le prix de l'article doit être supérieur à 0 ${idx + 1}`;
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
        showAlert(
          "Informations de l’utilisateur chargées avec succès !",
          "succès"
        );
      } else {
        // ✅ User not found (no crash)
        console.warn("⚠️ User not found:", res.data);
        setUserExists(false);
        setUserChecked(true);
        setCustomerName("");
        setphoneNumber("");
        setAddress("");
        showAlert(
          "L’utilisateur n’existe pas. Veuillez d’abord créer l’utilisateur.",
          "info"
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
          "L’utilisateur n’existe pas. Veuillez d’abord créer l’utilisateur..",
          "warning"
        );
      } else {
        showAlert(
          "Erreur lors de la récupération des détails de l’utilisateur. Veuillez réessayer.",
          "erreur"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch product details by product code
  // 🔍 Fetch product details by product code

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ✅ Step 1: Run existing validations
    if (!validate()) {
      setLoading(false);
      return;
    }

    // ✅ Step 2: Check payment vs shipping rule
    if (
      paymentStatus !== "payé" &&
      (shippingStatus === "expédié" || shippingStatus === "livraison")
    ) {
      showAlert(
        "Vous pouvez uniquement marquer une commande comme Expédiée ou Livrée une fois le paiement effectué.",
        "warning"
      );
      setLoading(false);
      return;
    }

    // ✅ Step 3: Continue your existing payload logic
    const formattedItems = orderItems.map((item) => ({
      productCode: item.productCode?.trim(),
      quantity: Number(item.quantity),
      size: Array.isArray(item.size)
        ? item.size.join(",")
        : String(item.size || ""),
      color: Array.isArray(item.color)
        ? item.color.join(",")
        : String(item.color || ""),
    }));

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

    try {
      const res = await axios.post(
        "https://dev-api.payonlive.com/api/order/create-order",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        showAlert("Commande créée avec succès!", "succès");
        navigate("/user/Orders");
      } else {
        showAlert(
          res.data?.message || "Échec de la création de la commande..",
          "erreur"
        );
      }
    } catch (error) {
      console.error("❌ Server Error:", error);
      //
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Échec de la récupération des détails du produit.";

      showAlert(message, "erreur");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductByCode = async (index, code) => {
    if (!code) return;

    try {
      const res = await axios.get(
        `https://dev-api.payonlive.com/api/product/product-code/${code}`
      );

      if (!res?.data?.success) return;

      const product = res.data.data;

      if (product.status !== "actif") {
        showAlert(
          `Produit "${product.productName}" est en rupture de stock.`,
          "erreur"
        );
        code("");
        return;
      }

      const splitAndClean = (value) => {
        if (!value && value !== 0) return [];
        if (Array.isArray(value)) {
          return value.flatMap((entry) => {
            if (!entry) return [];
            return String(entry)
              .split(/[,;|]/)
              .map((s) => s.trim())
              .filter(Boolean);
          });
        }
        if (typeof value === "string") {
          return value
            .split(/[,;|]/)
            .map((s) => s.trim())
            .filter(Boolean);
        }
        return [String(value).trim()];
      };

      let normalizedColors = splitAndClean(product.color);
      let normalizedSizes = splitAndClean(product.size);

      // ❗ Hide color/size when only “N/A”
      const isColorNA =
        normalizedColors.length === 1 &&
        normalizedColors[0].toUpperCase() === "N/A";
      const isSizeNA =
        normalizedSizes.length === 1 &&
        normalizedSizes[0].toUpperCase() === "N/A";

      const newItems = [...orderItems];
      newItems[index] = {
        ...newItems[index],
        productCode: code,
        productName: product.productName || "",
        price:
          typeof product.price === "number"
            ? product.price
            : Number(product.price) || 0,

        availableColors: isColorNA ? [] : normalizedColors,
        availableSizes: isSizeNA ? [] : normalizedSizes,

        // Set default N/A for backend when no color/size
        color: isColorNA ? "N/A" : "",
        size: isSizeNA ? "N/A" : "",
      };

      setOrderItems(newItems);
    } catch (error) {
      console.error("Error fetching product:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Échec de la récupération des détails du produit.";

      showAlert(message, "error");
    }
  };

  const handleColorSelect = (index, selectedColor) => {
    const newItems = [...orderItems];
    newItems[index].color =
      newItems[index].color === selectedColor ? "" : selectedColor;
    setOrderItems(newItems);
  };

  // ✅ Multi-select size handler
  const handleSizeSelect = (index, selectedSize) => {
    const newItems = [...orderItems];
    newItems[index].size =
      newItems[index].size === selectedSize ? "" : selectedSize;
    setOrderItems(newItems);
  };

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
      <Navbar heading="Gestion des commandes" />

      {/* discard button */}
      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Création de commande</h1>
        <button
          onClick={() => navigate("/user/Orders")}
          className="px-3 py-1 border border-red-700 text-red-700 bg-red-50 rounded-md hover:bg-gray-100"
        >
          <FontAwesomeIcon
            icon={faXmark}
            size="lg"
            className="text-red-700 px-2"
          />
          Jeter
        </button>
      </div>

      {/* Form wrapper */}
      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-6 sm:px-6 lg:px-8 py-6 space-y-8 font-sans text-gray-700"
      >
        {/* Create New Order */}
        <section className="border border-gray-400 rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-semibold pb-3">
            Créer une nouvelle commande
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Nom du client
              </label>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nom complet"
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
              {errors.customerName && (
                <p className="text-red-500 text-sm">{errors.customerName}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">E-mail</label>
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
                placeholder="Saisissez l'adresse e-mail pour obtenir les détails du client"
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Numéro de téléphone
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
                Adresse de livraison
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123, ville principale, état"
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
            <h2 className="text-lg font-semibold">Articles commandés</h2>
            <button
              onClick={addProduct}
              className="flex items-center gap-2 bg-green-600 text-white text-[12px] px-3 py-2 rounded-lg hover:bg-green-700"
              type="button"
            >
              <FontAwesomeIcon icon={faPlus} /> Ajouter un produit
            </button>
          </div>

          {orderItems.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-3 border-b border-gray-400"
            >
              {/* product code */}
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm font-medium">
                  Code produit
                </label>
                <input
                  value={item.productCode}
                  // onChange={(e) => handleProductChange(idx, e.target.value)}
                  onChange={(e) => {
                    const newItems = [...orderItems];
                    newItems[idx].productCode = e.target.value;
                    setOrderItems(newItems);
                  }}
                  onBlur={() => fetchProductByCode(idx, item.productCode)}
                  placeholder="Saisissez le code produit"
                  className="w-full text-sm  rounded-xl border px-2 py-2"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm">
                    {errors[`product_${idx}`]}
                  </p>
                )}
              </div>

              {/* product name */}
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm font-medium">
                  Nom du produit
                </label>
                <input
                  readOnly
                  value={item.productName}
                  // onChange={(e) => handleProductChange(idx, e.target.value)}
                  onChange={(e) => {
                    const newItems = [...orderItems];
                    newItems[idx].productName = e.target.value;
                    setOrderItems(newItems);
                  }}
                  onBlur={() => fetchProductByCode(idx, item.productName)}
                  placeholder="Nom du produit"
                  className="w-full text-sm  rounded-xl border px-2 py-2"
                />
                {errors.productName && (
                  <p className="text-red-500 text-sm">{errors.productName}</p>
                )}
              </div>

              {/* Color Section */}
              {/* Color Section */}
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm font-medium">
                  Couleur
                </label>

                {Array.isArray(item.availableColors) &&
                item.availableColors.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {item.availableColors.map((c, i) => {
                      const normalizedColor = c?.trim();
                      // const isSelected = Array.isArray(item.color)
                      //   ? item.color.includes(normalizedColor)
                      //   : false;
                      const isSelected = item.color === normalizedColor;

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
                          onClick={() =>
                            handleColorSelect(idx, normalizedColor)
                          }
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
                    value={
                      Array.isArray(item.color)
                        ? item.color[0] || ""
                        : item.color || ""
                    }
                    onChange={(e) => handleColorSelect(idx, e.target.value)}
                    className="w-full text-sm border rounded-lg px-2 py-2"
                  >
                    <option value="">Sélectionnez une couleur</option>
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
                <label className="block mb-1 text-sm font-medium">Taille</label>

                {Array.isArray(item.availableSizes) &&
                item.availableSizes.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {item.availableSizes.map((sz, i) => {
                      // const isSelected = Array.isArray(item.size)
                      //   ? item.size.includes(sz)
                      //   : false;
                      const isSelected = item.size === sz;

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
              <div className=" text-center">
                <label className="block mb-1 text-start text-sm font-medium">
                  Quantité
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
              <div className=" text-center">
                <label className="block mb-1 text-start text-sm font-medium">
                  Prix
                </label>
                <input
                  readOnly
                  type="number"
                  value={item.price}
                  className="w-full text-sm border rounded-lg px-2 py-2 text-center"
                />
              </div>

              {/* Total auto-calculated (read-only) */}
              <div className=" text-center">
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
              <div className=" flex justify-center">
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
              Mode de paiement
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">Sélectionnez mode de paiement</option>
              <option>Stripe</option>
              <option>Paypal</option>
            </select>
            {errors.paymentMethod && (
              <p className="text-red-500 text-sm">{errors.paymentMethod}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Statut du paiement
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">Sélectionnez statut du paiement</option>
              <option value="payé">Payé</option>
              <option value="enattente">En-attente</option>
              <option value="échoué">Échoué</option>
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
              Statut de livraison
            </label>
            <select
              value={shippingMethod}
              onChange={(e) => setShippingMethod(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">Sélectionnez mode de livraison</option>
              <option>Flat Rate</option>
              <option>Free Shipping</option>
              <option>Express</option>
              <option>Local Pickup</option>
            </select>
            {errors.shippingMethod && (
              <p className="text-red-500 text-sm">{errors.shippingMethod}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Statut de livraison
            </label>

            <select
              value={shippingStatus}
              onChange={(e) => setShippingStatus(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">Sélectionnez statut de la livraison</option>
              <option value="enattente">En-attente</option>
              <option value="Processing">Processing</option>
              <option value="expédié" disabled={paymentStatus !== "payé"}>
                Expédié
              </option>
              <option value="livraison" disabled={paymentStatus !== "payé"}>
                Livraison
              </option>
            </select>

            {errors.shippingStatus && (
              <p className="text-red-500 text-sm">{errors.shippingStatus}</p>
            )}
          </div>
        </section>

        {/* Order Summary */}
        <section className="border border-gray-400 rounded-lg p-4 w-full sm:w-80">
          <h3 className="font-semibold mb-4 text-sm text-gray-700">
            Résumé de la commande
          </h3>
          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex justify-between">
              <span>Sous Total</span>
              <span> € {subtotal} </span>
            </div>
            <div className="flex justify-between">
              <span>Impôt</span>
              <span> € {tax} </span>
            </div>

            <div className="flex justify-between">
              <span>Frais d'expédition</span>
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
            {loading ? "Soumettre..." : "Soumettre commande"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrder;
