// AddProductStep2.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SketchPicker } from "react-color";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck,
  faArrowLeft,
  faArrowRight,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../Components/Navbar";

function AddProductStep2({ formData, setFormData, prevStep, nextStep }) {
  const navigate = useNavigate();

  // States
  const [selectedGender, setSelectedGender] = useState(formData.gender || "Men");
  const [selectedSize, setSelectedSize] = useState(formData.size || []); // changed from single
  const [colors, setColors] = useState(["#FF0000", "#2563EB", "#8B5CF6", "#6B7280"]);
  const [selectedColor, setSelectedColor] = useState(formData.color || []);  // changed from single
  const [showColorPicker, setShowColorPicker] = useState(false);

  // New enable/disable toggles
  const [enableGender, setEnableGender] = useState(true);
  const [enableColor, setEnableColor] = useState(true);
  const [enableSize, setEnableSize] = useState(true);

  // Sync with formData based on enable/disable
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      gender: enableGender ? selectedGender : "N/A",
    }));
  }, [enableGender, selectedGender, setFormData]);

  // for select color
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      color: enableColor ? selectedColor : [],
    }));
  }, [enableColor, selectedColor, setFormData]);

  // for select size
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      size: enableSize ? selectedSize : [],
    }));
  }, [enableSize, selectedSize, setFormData]);

  const handleColorCommit = (color) => {
    const newColor = color.hex;
    if (!colors.includes(newColor)) setColors((p) => [...p, newColor]);
    setSelectedColor(newColor);
  };

  // Toggle color selection
  const toggleColor = (color) => {
    setSelectedColor((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
  };

  // Toggle size selection
  const toggleSize = (size) => {
    setSelectedSize((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    );
  };

  return (
    <div className="mb-20">
      <Navbar heading="Product Management" />

      <h1 className="mt-5 text-start mx-5 font-medium text-lg">Product Creation</h1>

         <div className="max-w-lg mx-auto mt-10 bg-white p-6">
        {/* Step indicator */}
        <div className="flex justify-center items-center mt-5 gap-4 mb-5">
          <div className="flex flex-col items-center text-black font-semibold">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#02B978] text-white ">
              
              <FontAwesomeIcon
                icon={faCheck}
                size="lg"
                className="text-white px-3 "
              />
              </div>
            <span className="mt-3 text-sm font-bold text-[#02B978] ">Enter Product Info</span>
          </div>

          <div className="flex-1 pb-5 border-t-3 border-[#02B978]"></div>

          <div className="flex flex-col items-center text-gray-400 font-semibold">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#02B978] text-white ">
              2
            </div>
            <span className="mt-3 font-bold text-sm text-[#02B978] ">Add variations</span>
          </div>

          <div className="flex-1 pb-5 border-t-3 border-gray-800"></div>

          <div className="flex flex-col items-center text-gray-400 font-semibold">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-400 text-white border border-gray-300">3</div>
            <span className="mt-3 text-sm">Add images</span>
          </div>
        </div>
      </div>

      {/* Form wrapper */}
      <form
        className="max-w-5xl mx-auto mt-10 p-6 border border-gray-300 rounded-2xl shadow-md bg-white"
        onSubmit={(e) => {
          e.preventDefault();
          nextStep();
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            {/* Gender */}
            <div>
              <div className="flex  mb-2">
                <h3 className="font-semibold text-gray-800">Gender</h3>
                <label className="flex items-center gap-2 mx-5 text-sm">
                  <input
                    type="checkbox"
                    checked={enableGender}
                    onChange={(e) => setEnableGender(e.target.checked)}
                    className="cursor-pointer"
                  />
                  Enable selection
                </label>
              </div>
              <div className="flex gap-3">
                {["Men", "Women", "Unisex"].map((gender) => (
                  <button
                    type="button"
                    key={gender}
                    disabled={!enableGender}
                    onClick={() => enableGender && setSelectedGender(gender)}
                    className={`px-4 py-2 rounded-lg border transition ${
                      selectedGender === gender && enableGender
                        ? "bg-[#6750A4] text-white "
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    } ${!enableGender ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="mt-5">
              <div className="flex  mb-2">
                <h3 className="font-semibold text-gray-800">Colors</h3>
                <label className="flex items-center mx-5 gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={enableColor}
                    onChange={(e) => setEnableColor(e.target.checked)}
                    className="cursor-pointer"
                  />
                  Enable selection
                </label>
              </div>
              <div className="flex gap-3 items-center flex-wrap">
                {colors.map((color, idx) => (
                  <div
                    key={idx}
                    className={`w-6 h-6 rounded-full border cursor-pointer transition-all ${
                      selectedColor.includes(color) && enableColor ? "ring-2 ring-purple-600 scale-110" : ""
                    } ${!enableColor ? "opacity-50 cursor-not-allowed" : ""}`}
                    style={{ backgroundColor: color }}
                    onClick={() => enableColor && toggleColor(color)}
                  />
                ))}
                <button
                  type="button"
                  disabled={!enableColor}
                  onClick={() => enableColor && setShowColorPicker((s) => !s)}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center text-gray-600 transition ${
                    !enableColor ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
                  }`}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>

              {enableColor && showColorPicker && (
  <div className="mt-3">
    <SketchPicker
      color={selectedColor[selectedColor.length - 1] || "#000000"} // show last selected color
      onChangeComplete={(color) => {
        const newColor = color.hex;
        if (!colors.includes(newColor)) {
          setColors((prev) => [...prev, newColor]);
        }
        // only add new color if not selected
        setSelectedColor((prev) =>
          prev.includes(newColor) ? prev : [...prev, newColor]
        );
      }}
    />
  </div>
)}


              {/* {enableColor && showColorPicker && (
                <div className="mt-3">
                  <SketchPicker
                    color={selectedColor}
                    onChange={(c) => setSelectedColor(c.hex)}
                    onChangeComplete={handleColorCommit}
                  />
                </div>
              )} */}
            </div>

           {/* Size */}
            <div className="mt-8">
              <div className="flex mb-2">
                <h3 className="font-semibold text-gray-800">Size</h3>
                <label className="flex items-center mx-9 gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={enableSize}
                    onChange={(e) => setEnableSize(e.target.checked)}
                    className="cursor-pointer"
                  />
                  Enable selection
                </label>
              </div>
              <div className="flex gap-3 flex-wrap">
                {["XS", "S", "M", "L", "XL"].map((size) => (
                  <button
                    type="button"
                    key={size}
                    disabled={!enableSize}
                    onClick={() => enableSize && toggleSize(size)}
                    className={`px-4 py-2 rounded-lg border transition ${
                      selectedSize.includes(size) && enableSize
                        ? "bg-[#6750A4] text-white "
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    } ${!enableSize ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6 mt-5">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Stock</h3>
              <input
                type="number"
                name="stock"
                required
                value={formData.stock || ""}
                onChange={(e) => setFormData((p) => ({ ...p, stock: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Category</h3>
              <select
                name="category"
                required
                value={formData.category || ""}
                onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select category</option>
                <option>Clothing</option>
                <option>Shoes</option>
                <option>Accessories</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button type="button" className="px-6 py-2 rounded-full bg-[#6750A4] text-white font-sm">
                Add Category
              </button>
              <button type="button" className="px-4 py-2 rounded-full bg-[#6750A4] text-white font-sm">
                Create Category
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between w-full mx-auto mt-10">
          <button
            type="button"
            onClick={() => navigate("/user/Products")}
            className="px-3 py-1 border border-red-700 text-red-700 bg-red-50 rounded-md hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={faXmark} size="lg" className="text-red-700 px-2" />
            Discard Product
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 bg-gray-900 text-white border rounded-lg hover:bg-gray-700"
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Prev
            </button>

            <button type="submit" className="px-4 py-2 bg-[#02B978] text-white rounded-lg hover:bg-[#04D18C]">
              Next <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddProductStep2;
