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
    tiktokSessionId: "",
    price: "",
    productName: "",
    productCode: "",
    status: "",
    gender: "Men",
    size: [],
    color: [],
    stock: "",
    category: "",
    images: [], // array of File (index -> file)
  });

  const nextStep = () => setCurrentStep((s) => Math.min(3, s + 1));
  const prevStep = () => setCurrentStep((s) => Math.max(1, s - 1));
  const goToStep = (n) => setCurrentStep(n);

  // final submit (multipart/form-data) — sends all params + files
//   const handleSubmit = async () => {
//   try {
//     const data = new FormData();

//     // append scalar fields safely
//     data.append("tiktokSessionId", formData.tiktokSessionId || "");
//     data.append("price", formData.price ? Number(formData.price) : 0);
//     data.append("productName", formData.productName || "");
//     data.append("productCode", formData.productCode || "");
//     data.append("status", formData.status || "");
//     data.append("gender", formData.gender || "Men");
//     data.append("size", formData.size || "M");
//     data.append("color", formData.color || "#B21E1E");
//     data.append("stock", formData.stock ? Number(formData.stock) : 0);
//     data.append("category", formData.category || "");

//     // images: append each file as images[]
//     if (Array.isArray(formData.images)) {
//       formData.images.forEach((file) => {
//         if (file) data.append("images[]", file);
//       });
//     }

//     // POST request
//     const res = await axios.post(
//       "https://la-dolce-vita.onrender.com/api/product/add-product",
//       data
//     );

//     window.alert("✅ Product created successfully");
//     navigate("/user/Products");

//   } catch (err) {
//     if (err.response) {
//       console.error("Backend error:", err.response.data);
//       window.alert(`❌ Error: ${JSON.stringify(err.response.data)}`);
//     } else {
//       console.error("API submit error:", err);
//       window.alert("❌ Error submitting product (check console)");
//     }
//   }
// };



// this will work properly for a backup code
// const handleSubmit = async () => {
//   try {
//     const data = new FormData();
    

//     // append all text fields
//     data.append("productName", formData.productName || "");
//     data.append("productCode", formData.productCode || "");
//     data.append("price", formData.price || "");
//     data.append("tiktokSessionId", formData.tiktokSessionId || "");
//     data.append("gender", formData.gender || "Men");
//     data.append("color", formData.color || "");
//     data.append("size", formData.size || "");
//     data.append("stock", formData.stock || "");
//     data.append("category", formData.category || "");
//     data.append("status", formData.status || "");

//     // append images (without [])
//     if (Array.isArray(formData.images)) {
//       formData.images.forEach((file) => {
//         if (file) data.append("images", file);
//       });
//     }

//     // post request
//     console.log(data);
//     const res = await axios.post(
//       "https://dev-api.payonlive.com/api/product/add-product",
//       data,
//       {
//         withCredentials: true, // only if cookies/session used
//       }
//     );
//     console.log("data the data is added"+data);
    

//     showAlert("Product created successfully!", "success");
//     navigate("/user/Products");
//   } 
//   catch (err) {
//     console.error("Backend error:", err.response?.data || err.message);
//     // window.alert(`❌ Error: ${JSON.stringify(err.response?.data || err.message)}`);
//     showAlert("Failed to create Product. Please try again.", "error");
//   }
// };

const handleSubmit = async () => {
  try {
    const data = new FormData();

    // Append all scalar fields
    data.append("productName", formData.productName || "");
    data.append("productCode", formData.productCode || "");
    data.append("price", formData.price || "");
    data.append("tiktokSessionId", formData.tiktokSessionId || "");
    data.append("gender", formData.gender || "Men");
    data.append("stock", formData.stock || "");
    data.append("category", formData.category || "");
    data.append("status", formData.status || "");

    // ✅ Append colors as array
    if (Array.isArray(formData.color) && formData.color.length > 0) {
      formData.color.forEach((clr) => data.append("color[]", clr));
    }

    // ✅ Append sizes as array
    if (Array.isArray(formData.size) && formData.size.length > 0) {
      formData.size.forEach((sz) => data.append("size[]", sz));
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

    showAlert("✅ Product created successfully!", "success");
    navigate("/user/Products");
  } catch (err) {
    console.error("Backend error:", err.response?.data || err.message);
    showAlert("❌ Failed to create product. Please try again.", "error");
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
