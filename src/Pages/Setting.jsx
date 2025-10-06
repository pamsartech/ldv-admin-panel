import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faTriangleExclamation,
  faFlask,
  faCheckCircle,
  faXmark,
  faSave,
  faKey,
  faDatabase,
} from "@fortawesome/free-solid-svg-icons";

export default function Setting() {
  const [envMode, setEnvMode] = useState("sandbox");
  const [mondialKey, setMondialKey] = useState("");
  const [mondialValue, setMondialValue] = useState("");
  const [stripeKey, setStripeKey] = useState("");
  const [stripeSecret, setStripeSecret] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  return (

    <div>

        <Navbar heading = "Settings" />
      <h2 className="text-lg font-medium mx-5 mt-5 text-gray-900"> Delivery partner & payment Settings </h2>
        

    <div className="max-w-4xl border rounded-2xl mx-5 mt-8 border-gray-400 px-4 p-6 space-y-6 text-gray-800">
      {/* Mondial APIs Section */}
      <div className=" p-6 shadow-sm bg-white">
        <h2 className="text-lg font-medium mb-4">Mondial APIs – Sandbox/Live</h2>
        <p className="text-sm text-gray-500 mb-4">
          Configure your mondial delivery partner integration settings
        </p>

        {/* Environment Mode */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Environment Mode</p>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="envMode"
                value="sandbox"
                checked={envMode === "sandbox"}
                onChange={() => setEnvMode("sandbox")}
                className="accent-purple-600"
              />
              <FontAwesomeIcon icon={faDatabase} className="text-orange-400 text-xs ml-5" />
              <span className="text-sm">Sandbox</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="envMode"
                value="live"
                checked={envMode === "live"}
                onChange={() => setEnvMode("live")}
                className="accent-purple-600"
              />
              <FontAwesomeIcon icon={faDatabase} className="text-green-600 text-xs" />
              <span className="text-xs">Live</span>
            </label>
          </div>
        </div>

        {/* Mondial Keys */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Mondial Key*"
            value={mondialKey}
            onChange={(e) => setMondialKey(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Mondial Value*"
            value={mondialValue}
            onChange={(e) => setMondialValue(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Environment Status */}
        <div className="flex justify-between items-center text-sm border rounded-lg px-3 py-2">
          <span>
            Current Environment:{" "}
            <span className="font-medium capitalize">{envMode}</span>
          </span>
          <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded">
            Test mode active
          </span>
        </div>

        {/* API Help Box */}
        <div className="mt-4 bg-blue-50 border border-blue-100 text-sm rounded-lg p-4 space-y-1">
          <p className="font-medium text-blue-700">API Configuration Help:</p>
          <ul className="list-disc ml-5 text-blue-600">
            <li>Obtain your API credentials from your Mondial partner dashboard</li>
            <li>Always test with Sandbox mode before switching to Live</li>
            <li>Keep your API credentials secure and never share them publicly</li>
            <li>Contact Mondial support if you encounter authentication issues</li>
          </ul>
        </div>
      </div>

      {/* Stripe Section */}
      <div className=" p-6 shadow-sm bg-white">
        <h2 className="text-lg font-medium mb-4">Stripe Payment Gateway Parameters</h2>
        <p className="text-sm text-gray-500 mb-4">
          Configure your Stripe payment processing integration settings
        </p>

        {/* Environment */}
        <div className="mb-4">
          <p className="text-sm font-medium">Environment Type*</p>
          <input
              placeholder="Sandbox Test Environment "
              className="border rounded-lg placeholder:text-sm px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        {/* Stripe API Key (Publishable) */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            API Key (Publishable)*
          </label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={stripeKey}
              onChange={(e) => setStripeKey(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              <FontAwesomeIcon icon={showKey ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>

        {/* Stripe Secret Key */}
        {/* <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Secret Key*</label>
          <div className="relative">
            <input
              type={showSecret ? "text" : "password"}
              value={stripeSecret}
              onChange={(e) => setStripeSecret(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              <FontAwesomeIcon icon={showSecret ? faEyeSlash : faEye} />
            </button>
          </div>
        </div> */}

        {/* Status */}
        <div className="flex justify-between items-center text-sm border rounded-lg px-3 py-2 mb-4">
          <span>Connection Status: Configured</span>
          <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded">
            Test mode active
          </span>
        </div>

        {/* Security Notes */}
        <div className="bg-yellow-50 border border-yellow-100 text-sm rounded-lg p-4 space-y-1">
          <p className="font-medium text-yellow-700">Security Best Practices:</p>
          <ul className="list-disc ml-5 text-yellow-600">
            <li>Never share your secret key or commit it to version control</li>
            <li>Use environment variables to store sensitive credentials</li>
            <li>Regularly rotate your API keys for enhanced security</li>
            <li>Monitor your Stripe dashboard for suspicious activity</li>
            <li>Test thoroughly in sandbox before enabling live payments</li>
          </ul>
        </div>

        {/* Webhook Info */}
        <div className="mt-4 bg-blue-50 border border-blue-100 text-sm rounded-lg p-4">
          <p className="font-medium text-blue-700">Webhook Configuration:</p>
          <p className="text-blue-600">
            Don’t forget to configure your webhook endpoints in your Stripe
            dashboard to receive real-time payment updates.
          </p>
          <p className="text-blue-600 font-mono mt-2">
            https://yourdomain.com/api/webhooks/stripe
          </p>
        </div>
      </div>

      {/* Save/Discard Buttons */}
      <div className="flex justify-between items-center pt-4">
        <p className="text-sm text-yellow-700 bg-yellow-50 border w-full px-3 py-2 rounded flex items-center gap-2">
          <FontAwesomeIcon icon={faTriangleExclamation} />
          You have unsaved changes. Don’t forget to save your configuration.
        </p>
        {/* <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
            <FontAwesomeIcon icon={faXmark} />
            Discard Changes
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FontAwesomeIcon icon={faSave} />
            Save Changes
          </button>
        </div> */}
      </div>

     <hr className="text-gray-400" />

     <div className="flex gap-3 justify-end">
          <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
            <FontAwesomeIcon icon={faXmark} />
            Discard Changes
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FontAwesomeIcon icon={faSave} />
            Save Changes
          </button>
        </div>

    </div>
    
    </div>
  );
}
