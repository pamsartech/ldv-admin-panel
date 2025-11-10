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

        <Navbar heading = "Paramètre" />
      <h2 className="text-lg font-medium mx-5 mt-5 text-gray-900"> Paramètres du partenaire de livraison et de paiement </h2>
        

    <div className="max-w-4xl border rounded-2xl mx-5 mt-8 border-gray-400 px-4 p-6 space-y-6 text-gray-800">
      {/* Mondial APIs Section */}
      <div className=" p-6 shadow-sm bg-white">
        <h2 className="text-lg font-medium mb-4">Mondial APIs – Bac à sable / Production</h2>
        <p className="text-sm text-gray-500 mb-4">
          Configurer vos paramètres d’intégration avec le partenaire de livraison Mondial
        </p>

        {/* Environment Mode */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Mode d’environnement</p>
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
              <span className="text-sm">Bac à sable (test)</span>
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
              <span className="text-xs">Production</span>
            </label>
          </div>
        </div>

        {/* Mondial Keys */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Clé Mondial*"
            value={mondialKey}
            onChange={(e) => setMondialKey(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Valeur Mondial*"
            value={mondialValue}
            onChange={(e) => setMondialValue(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Environment Status */}
        <div className="flex justify-between items-center text-sm border rounded-lg px-3 py-2">
          <span>
            Environnement actuel : {" "}
            <span className="font-medium capitalize">{envMode}</span>
          </span>
          <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded">
            Mode test actif
          </span>
        </div>

        {/* API Help Box */}
        <div className="mt-4 bg-blue-50 border border-blue-100 text-sm rounded-lg p-4 space-y-1">
          <p className="font-medium text-blue-700">Aide à la configuration de l’API:</p>
          <ul className="list-disc ml-5 text-blue-600">
            <li>Obtenez vos identifiants API depuis le tableau de bord de votre partenaire Mondial</li>
            <li>Testez toujours avec le mode bac à sable avant de passer en production</li>
            <li>Gardez vos identifiants API sécurisés et ne les partagez jamais publiquement</li>
            <li>Contactez le support Mondial en cas de problème d’authentification</li>
          </ul>
        </div>
      </div>

      {/* Stripe Section */}
      <div className=" p-6 shadow-sm bg-white">
        <h2 className="text-lg font-medium mb-4">Paramètres de la passerelle de paiement Stripe</h2>
        <p className="text-sm text-gray-500 mb-4">
          Configurer vos paramètres d’intégration Stripe pour le traitement despaiements 
        </p>

        {/* Environment */}
        <div className="mb-4">
          <p className="text-sm font-medium">Type d’environnement*</p>
          <input
              placeholder=" Environnement de test (bac à sable) "
              className="border rounded-lg placeholder:text-sm px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        {/* Stripe API Key (Publishable) */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Clé API (publique)*
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
          <span>Statut de connexion: Configuré</span>
          <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded">
            Mode test actif
          </span>
        </div>

        {/* Security Notes */}
        <div className="bg-yellow-50 border border-yellow-100 text-sm rounded-lg p-4 space-y-1">
          <p className="font-medium text-yellow-700">Bonnes pratiques de sécurité:</p>
          <ul className="list-disc ml-5 text-yellow-600">
            <li>Ne partagez jamais votre clé secrète et ne la soumettez pas dans un système de versionnage</li>
            <li>Utilisez des variables d’environnement pour stocker les informations sensibles</li>
            <li>Changez régulièrement votre clé API pour renforcer la sécurité</li>
            <li>Surveillez votre tableau de bord Stripe pour toute activité suspecte</li>
            <li>Testez minutieusement en mode bac à sable avant d’activer les paiements en direct</li>
          </ul>
        </div>

        {/* Webhook Info */}
        <div className="mt-4 bg-blue-50 border border-blue-100 text-sm rounded-lg p-4">
          <p className="font-medium text-blue-700">Configuration du Webhook:</p>
          <p className="text-blue-600">
            N’oubliez pas de configurer vos points de terminaison Webhook dans votre tableau
de bord Stripe pour recevoir les mises à jour de paiement en temps réel
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
          Vous avez des modifications non enregistrées.
N’oubliez pas d’enregistrer votre configuration.
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
            Annuler les modifications
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FontAwesomeIcon icon={faSave} />
            Enregistrer les modifications
          </button>
        </div>

    </div>
    
    </div>
  );
}
