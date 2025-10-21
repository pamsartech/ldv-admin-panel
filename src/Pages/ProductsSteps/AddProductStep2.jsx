// AddProductStep2.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SketchPicker } from "react-color";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faPlus,
  faUpload,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../Components/Navbar";

function AddProductStep2({ formData, setFormData, prevStep, nextStep }) {
  const navigate = useNavigate();

  const [selectedGender, setSelectedGender] = useState(formData.gender || "Men");
  const [selectedSize, setSelectedSize] = useState(formData.size || "M");
  const [colors, setColors] = useState(["#FF0000", "#2563EB", "#8B5CF6", "#6B7280"]);
  const [selectedColor, setSelectedColor] = useState(formData.color || "#B21E1E");
  const [showColorPicker, setShowColorPicker] = useState(false);

  // keep central state in sync
  useEffect(() => {
    setFormData((prev) => ({ ...prev, gender: selectedGender }));
  }, [selectedGender, setFormData]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, size: selectedSize }));
  }, [selectedSize, setFormData]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, color: selectedColor }));
  }, [selectedColor, setFormData]);

  const handleColorCommit = (color) => {
    const newColor = color.hex;
    if (!colors.includes(newColor)) setColors((p) => [...p, newColor]);
    setSelectedColor(newColor);
  };

  const handleSizeGuideUpload = (e) => {
    const f = e.target.files?.[0];
    if (f) setFormData((prev) => ({ ...prev, sizeGuideFile: f }));
  };

  return (
    <div className="mb-20">
      <Navbar heading="Product Management" />

      <h1 className="mt-5 text-start mx-5 font-medium text-lg">Product Creation</h1>

      <div className="max-w-lg mx-auto mt-10 bg-white p-6">
        {/* Step indicator */}
        <div className="flex justify-center items-center mt-5 gap-4 mb-5">
          <div className="flex flex-col items-center text-black font-semibold">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-400 text-white ">1</div>
            <span className="mt-3 text-sm font-bold text-gray-400 ">Enter Product Info</span>
          </div>

          <div className="flex-1 pb-5 border-t-3 border-gray-800"></div>

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

      {/* Form wrapper for HTML5 validation */}
      <form
        className=" w-3xl mx-auto  p-6 border border-gray-300 rounded-2xl shadow-md bg-white"
        onSubmit={(e) => {
          e.preventDefault(); // prevent reload
          nextStep(); // only called if validation passes
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            {/* Gender (hidden required input to enforce validation) */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Gender</h3>
              <div className="flex gap-3">
                {["Men", "Women", "Unisex"].map((gender) => (
                  <button
                    type="button"
                    key={gender}
                    onClick={() => setSelectedGender(gender)}
                    className={`px-4 py-2 rounded-lg border transition ${
                      selectedGender === gender
                        ? "bg-[#6750A4] text-white "
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
              <input type="hidden" name="gender" value={selectedGender} required />
            </div>

            {/* Colours */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Colours</h3>
              <div>
                <div className="flex gap-3 items-center flex-wrap">
                  {colors.map((color, idx) => (
                    <div
                      key={idx}
                      className={`w-8 h-8 rounded-full border cursor-pointer transition-all ${
                        selectedColor === color ? "ring-2 ring-purple-600 scale-110" : ""
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}

                  <button
                    type="button"
                    onClick={() => setShowColorPicker((s) => !s)}
                    className="w-8 h-8 rounded-full border flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>

                {showColorPicker && (
                  <div className="mt-3">
                    <SketchPicker
                      color={selectedColor}
                      onChange={(c) => setSelectedColor(c.hex)}
                      onChangeComplete={handleColorCommit}
                    />
                  </div>
                )}
              </div>
              <input type="hidden" name="color" value={selectedColor} required />
            </div>

            {/* Size */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Size</h3>
              <div className="flex gap-3">
                {["XS", "S", "M", "L", "XL"].map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border transition ${
                      selectedSize === size ? "bg-[#6750A4] text-white " : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <input type="hidden" name="size" value={selectedSize} required />
            </div>

            {/* Size Chart Upload (optional, so no required) */}
            {/* <div>
              <label
                htmlFor="sizeGuideUpload"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border font-medium cursor-pointer hover:bg-gray-100 transition"
              >
                <FontAwesomeIcon icon={faUpload} /> Add product Size guide Chart
              </label>
              <input
                id="sizeGuideUpload"
                type="file"
                accept=".png,.jpg,.jpeg,.pdf"
                className="hidden"
                onChange={handleSizeGuideUpload}
              />
              {formData.sizeGuideFile && (
                <div className="mt-2 text-sm text-gray-600">{formData.sizeGuideFile.name}</div>
              )}
            </div> */}
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
                <option>Jacket</option>
                <option>Shoes</option>
                <option>T-shirt</option>
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
        <div className="flex justify-between max-w-lg mx-auto mt-10 ">
          <button
            type="button"
            onClick={() => navigate("/user/Products")}
            className=" px-3 py-1 border border-red-700 text-red-700 bg-red-50 rounded-md hover:bg-gray-100"
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


