// AddProductWizard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddProductStep1 from "./AddProductStep1";
import AddProductStep2 from "./AddProductStep2";
import AddProductStep3 from "./AddProductStep3";

export default function AddProductWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // centralised form data (files kept as File objects)
  const [formData, setFormData] = useState({
    tiktokSessionId: "",
    price: "",
    productName: "",
    productCode: "",
    gender: "Men",
    size: "M",
    color: "#B21E1E",
    stock: "",
    category: "",
    images: [], // array of File (index -> file)
  });

  const nextStep = () => setCurrentStep((s) => Math.min(3, s + 1));
  const prevStep = () => setCurrentStep((s) => Math.max(1, s - 1));
  const goToStep = (n) => setCurrentStep(n);

  // final submit (multipart/form-data) — sends all params + files
  const handleSubmit = async () => {
    try {
      const data = new FormData();

      // append scalar fields
      data.append("tiktokSessionId", formData.tiktokSessionId || "");
      data.append("price", formData.price || "");
      data.append("productName", formData.productName || "");
      data.append("productCode", formData.productCode || "");
      data.append("gender", formData.gender || "");
      data.append("size", formData.size || "");
      data.append("color", formData.color || "");
      data.append("stock", formData.stock || "");
      data.append("category", formData.category || "");

      // images: append each file (backend expects array `images`)
      if (Array.isArray(formData.images)) {
        formData.images.forEach((file) => {
          if (file) data.append("images", file);
        });
      }

      // POST - URL  endpoint
      await axios.post("https://la-dolce-vita.onrender.com/api/product/add-product", data, {
        // DO NOT set Content-Type; axios will set proper multipart boundary
      });

      // success
      window.alert("✅ Product created successfully");
      navigate("/Products");
    } catch (err) {
      console.error("API submit error:", err);
      window.alert("❌ Error submitting product (check console)");
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
