// AddProductWizard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddProductStep1 from "./AddProductStep1";
import AddProductStep2 from "./AddProductStep2";
import AddProductStep3 from "./AddProductStep3";
import { useAlert } from "../../Components/AlertContext";

export default function AddProductWizard() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [currentStep, setCurrentStep] = useState(1);

  // centralised form data (files kept as File objects)
  const [formData, setFormData] = useState({
    tiktok_session_id: "",
    price: "",
    productName: "",
    productCode: "",
    status: "",
    gender: "",
    size: [],
    color: [],
    stock: "",
    category: "",
    images: [], // array of File (index -> file)
  });

  const nextStep = () => setCurrentStep((s) => Math.min(3, s + 1));
  const prevStep = () => setCurrentStep((s) => Math.max(1, s - 1));
  const goToStep = (n) => setCurrentStep(n);

  const handleSubmit = async () => {
    try {
      const data = new FormData();

      // Append all scalar fields
      data.append("productName", formData.productName || "");
      data.append("productCode", formData.productCode || "");
      data.append("price", formData.price || "");
      data.append("tiktok_session_id", formData.tiktok_session_id || "");
      data.append("gender", formData.gender || "Men");
      data.append("stock", formData.stock || "");
      data.append("category", formData.category || "");
      data.append("status", formData.status || "");

      // ✅ Append colors as array
      if (Array.isArray(formData.color) && formData.color.length > 0) {
        formData.color.forEach((clr) => data.append("color[]", clr));
      } else if (formData.color === "N/A") {
        // backend expects the field — send single value "N/A"
        data.append("color", "N/A");
      }

      // ✅ Append sizes as array
      if (Array.isArray(formData.size) && formData.size.length > 0) {
        formData.size.forEach((sz) => data.append("size[]", sz));
      } else if (formData.size === "N/A") {
        data.append("size", "N/A");
      }

      // ✅ Append images as array
      if (Array.isArray(formData.images) && formData.images.length > 0) {
        formData.images.forEach((file) => {
          if (file) data.append("images", file);
        });
      }

      // Debug log to verify FormData contents
      for (let [key, value] of data.entries()) {
        console.log(`${key}:`, value);
      }

      // ✅ Make POST request
      const res = await axios.post(
        "https://dev-api.payonlive.com/api/product/add-product",
        data,
        { withCredentials: true }
      );

      showAlert(" Product created successfully!", "success");
      navigate("/user/Products");
    } catch (err) {
      console.error("Backend error:", err.response?.data);
      showAlert("" + err.response.data.message, "info");
    }
  };

  return (
    <div>
      {currentStep === 1 && (
        <AddProductStep1
          formData={formData}
          setFormData={setFormData}
          nextStep={nextStep}
          goToStep={goToStep}
        />
      )}

      {currentStep === 2 && (
        <AddProductStep2
          formData={formData}
          setFormData={setFormData}
          prevStep={prevStep}
          nextStep={nextStep}
        />
      )}

      {currentStep === 3 && (
        <AddProductStep3
          formData={formData}
          setFormData={setFormData}
          prevStep={prevStep}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
