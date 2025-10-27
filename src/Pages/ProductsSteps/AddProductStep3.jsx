/// AddProductStep3.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheck,
  faXmark,
  faPlus,
  faTimes,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";

function AddProductStep3({ formData, setFormData, prevStep, handleSubmit }) {
  const navigate = useNavigate();
  

  // Side image previews (4 slots)
  const [previews, setPreviews] = useState(
    Array(4)
      .fill(null)
      .map((_, i) =>
        formData.images?.[i] ? URL.createObjectURL(formData.images[i]) : null
      )
  );

  // Index of side image shown in main preview
  const [selectedIndex, setSelectedIndex] = useState(
    previews.findIndex((p) => p !== null) >= 0
      ? previews.findIndex((p) => p !== null)
      : 0
  );

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      previews.forEach((url) => url && URL.revokeObjectURL(url));
    };
  }, [previews]);

  // Handle side image upload
  const handleImageUpload = (event, index) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    setPreviews((prev) => {
      const updated = [...prev];
      updated[index] = url;
      return updated;
    });

    setFormData((prev) => {
      const imgs = [...(prev.images || [])];
      imgs[index] = file;
      return { ...prev, images: imgs };
    });

    setSelectedIndex(index); // Show newly uploaded image in main preview
  };

  // Handle image removal
  const handleRemoveImage = (index) => {
    setPreviews((prev) => {
      const updated = [...prev];
      const url = updated[index];
      if (url) URL.revokeObjectURL(url);
      updated[index] = null;
      return updated;
    });

    setFormData((prev) => {
      const imgs = [...(prev.images || [])];
      imgs[index] = null;
      return { ...prev, images: imgs };
    });

    // Update main preview to first available image
    if (selectedIndex === index) {
      const nextIndex = previews.findIndex((p, i) => p !== null && i !== index);
      setSelectedIndex(nextIndex >= 0 ? nextIndex : 0);
    }
  };

  // When a side image is clicked, show it in main preview
  const handleSelectMain = (index) => {
    if (previews[index]) setSelectedIndex(index);
  };

  return (
    <div className="mb-10">
      <Navbar heading="Product Management" />

      <h1 className="mt-5 text-start mx-5 font-medium text-lg">
        Product Creation
      </h1>

      <div className="max-w-xl mx-auto mt-10 bg-white p-6 border-0">
        {/* progress indicator */}
        <div className="flex justify-center items-center mt-5 gap-4 mb-5">
          <div className="flex flex-col items-center text-black font-semibold">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#02B978] text-white">
              <FontAwesomeIcon
                icon={faCheck}
                size="lg"
                className="text-white px-3 "
              />
            </div>
            <span className="mt-3 text-sm font-bold text-gray-400">
              Enter Product Info
            </span>
          </div>
          <div className="flex-1 pb-5 border-t-3 border-[#02B978]"></div>
          <div className="flex flex-col items-center text-gray-400 font-semibold">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#02B978] text-white">
              <FontAwesomeIcon
                icon={faCheck}
                size="lg"
                className="text-white px-3 "
              />
            </div>
            <span className="mt-3 font-bold text-sm text-[#02B978]">
              Add variations
            </span>
          </div>
          <div className="flex-1 pb-5 border-t-3 border-[#02B978]"></div>
          <div className="flex flex-col items-center text-gray-400 font-semibold">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#02B978] text-white border border-gray-300">
              3
            </div>
            <span className="mt-3 text-sm text-[#02B978]">Add images</span>
          </div>
        </div>
      </div>

      {/* FORM START */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* main preview and side uploads */}
        <div className="bg-gray-100 mx-auto p-6 rounded-2xl w-full max-w-lg">
          <h3 className="font-semibold text-gray-800 mb-3">Upload Images</h3>
          <div className="flex gap-4 rounded-2xl">
            {/* Main Preview */}
            <div className="relative flex-1">
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-gray-300 rounded-xl h-64 bg-white overflow-hidden">
                {previews[selectedIndex] ? (
                  <img
                    src={previews[selectedIndex]}
                    alt="Main Preview"
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-gray-500">No image selected</span>
                )}
              </div>
            </div>

            {/* Side Uploads */}
            <div className="flex flex-col gap-3">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="relative">
                  <label
                    htmlFor={`sideImageUpload-${index}`}
                    className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 transition overflow-hidden"
                  >
                    {previews[index] ? (
                      <img
                        src={previews[index]}
                        alt={`Upload ${index}`}
                        className="w-full h-full object-cover rounded-lg"
                        onClick={() => handleSelectMain(index)}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faPlus}
                        className="text-gray-600"
                      />
                    )}
                  </label>
                  <input
                    id={`sideImageUpload-${index}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, index)}
                    required={index === 0} // ✅ HTML5 required only for the first image
                  />
                  {previews[index] && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1"
                    >
                      <FontAwesomeIcon icon={faTimes} size="sm" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <h6 className="text-center text-sm font-medium my-4">
          <FontAwesomeIcon icon={faCircleInfo} /> The size of each image should
          not be more than 5 MB
        </h6>

        {/* navigation */}
        <div className="flex justify-between max-w-lg mx-auto mt-6">
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
            Discard Product
          </button>

          <button
            type="button"
            onClick={prevStep}
            className="px-4 py-2 bg-gray-900 text-white border rounded-lg hover:bg-gray-700"
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Prev
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-[#02B978] text-white rounded-lg hover:bg-[#04D18C]"
          >
            Submit <FontAwesomeIcon icon={faCheck} />
          </button>

        </div>
      </form>
      {/* FORM END */}
    </div>
  );
}

export default AddProductStep3;
