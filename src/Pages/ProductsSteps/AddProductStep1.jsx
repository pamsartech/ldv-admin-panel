// AddProductStep1.jsx
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faXmark,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

function AddProductStep1({ formData, setFormData, nextStep }) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const validateStep1 = async () => {
    const newErrors = {};

    if (!formData.productName?.trim()) {
      newErrors.productName = "Le nom du produit est requis.";
    }

    if (!formData.productCode?.trim()) {
      newErrors.productCode = "Le code produit est requis.";
    }

    if (!formData.price || Number(formData.price) < 0) {
      newErrors.price = "Le prix du produit est requis";
    }

    if (!formData.status) {
      newErrors.status = "Le statut est requis.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // stop page reload
    const ok = await validateStep1();
    if (!ok) return;
    nextStep(); // only called if all required fields are valid
  };

  return (
    <div>
      <Navbar heading="Gestion des produits" />

      <h1 className="mt-5 text-start mx-5 font-medium text-lg">
        Création de produits
      </h1>
      <h1 className="text-center mt-5 text-gray-800 font-medium text-2xl">
        Créer un produit
      </h1>

      <div className="max-w-3xl mx-auto mt-2 bg-white p-6 shadow rounded">
        {/* Progress indicator unchanged */}
        <div className="flex justify-center items-center gap-4 mb-10">
          <div className="flex flex-col items-center text-black font-semibold">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#02B978] text-white border border-[#02B978]">
              1
            </div>
            <span className="mt-3 text-sm font-bold text-[#02B978] ">
              Saisir les informations sur le produit
            </span>
          </div>

          <div className="flex-1 pb-5 border-t-3 border-gray-800"></div>

          <div className="flex flex-col items-center text-gray-400 font-semibold">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-400 text-white border border-gray-300">
              2
            </div>
            <span className="mt-3 font-bold text-sm">
              Ajouter des variations
            </span>
          </div>

          <div className="flex-1 pb-5 border-t-3 border-gray-800"></div>

          <div className="flex flex-col items-center text-gray-400 font-semibold">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-400 text-white border border-gray-300">
              3
            </div>
            <span className="mt-3 text-sm">Ajouter des images</span>
          </div>
        </div>

        {/* ✅ Wrap inputs in a <form> */}
        <form
          onSubmit={handleSubmit}
          className="border border-gray-300 rounded-xl shadow-sm p-7 bg-gray-50 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl">
              <label className="block text-sm font-medium mb-1">
                Session TikTok
              </label>
              <input
                name="tiktok_session_id"
                type="text"
                placeholder="Code vestimentaire 2025"
                value={formData.tiktok_session_id || ""}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prix</label>
              <input
                name="price"
                type="number"
                placeholder="€12"
                value={formData.price || ""}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
              {errors.price && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.price}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nom du produit
              </label>
              <input
                name="productName"
                type="text"
                placeholder="Denim shirt 202045"
                value={formData.productName || ""}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
              {errors.productName && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.productName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Code produit
              </label>
              <input
                name="productCode"
                type="text"
                placeholder="3211"
                value={formData.productCode || ""}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
              {errors.productCode && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.productCode}
                </p>
              )}
            </div>

            {/* ✅ Status Dropdown */}
            <div className=" col-span-2">
              <label className=" text-sm font-medium mb-1">Statut</label>
              <select
                name="status"
                value={formData.status || ""}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="">Sélectionner le statut</option>
                <option value="actif">Actifs</option>
                <option value="inactif">Inactif</option>
              </select>
               {errors.status && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.status}
                </p>
              )}
            </div>
          </div>

          {/* navigation buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/user/Products")}
              className="px-3 py-1 border border-red-700 text-red-700 bg-red-50 rounded-md hover:bg-gray-100"
            >
              <FontAwesomeIcon
                icon={faXmark}
                size="lg"
                className="text-red-700 px-2"
              />
              Jeter Produit
            </button>

            {/* ✅ make Next button submit the form */}
            <button
              type="submit"
              className="px-4 py-2 bg-[#02B978] text-white rounded-lg hover:bg-[#04D18C]"
            >
              Suivant
              <FontAwesomeIcon
                icon={faArrowRight}
                size="lg"
                className="text-white px-3 "
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductStep1;
