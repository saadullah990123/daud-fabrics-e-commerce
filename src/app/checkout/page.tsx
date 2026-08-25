"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { formatPKR, PAKISTAN_MAJOR_CITIES } from "@/lib/format";
import {
  Lock,
  Truck,
  ShieldCheck,
  CreditCard,
  Banknote,
  Smartphone,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ChevronRight,
  Info,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shippingFee, total, clearCart } = useCart();

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [city, setCity] = useState("Lahore");
  const [customCity, setCustomCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "easypaisa" | "meezan_bank">("cod");

  // Payment Screenshot proof
  const [screenshotData, setScreenshotData] = useState<string | null>(null);
  const [screenshotFileName, setScreenshotFileName] = useState<string | null>(null);
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);

  // Settings from DB
  const [settings, setSettings] = useState({
    easypaisa_title: "Daud Fabrics / Daud Ahmed",
    easypaisa_number: "0300-1234567",
    easypaisa_instructions: "Send payment to the EasyPaisa number above, then upload a screenshot of your transaction receipt.",
    meezan_bank_title: "Daud Fabrics Pvt Ltd",
    meezan_bank_account: "0289-0105829101",
    meezan_bank_iban: "PK65MEZN0002890105829101",
    meezan_bank_branch: "Gulberg III Main Branch, Lahore",
    meezan_bank_instructions: "Transfer the order total to our Meezan Bank account via Raast or Online Banking. Upload your transfer receipt/screenshot proof below.",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
      })
      .catch(() => {});
  }, []);

  // Handle file screenshot upload
  const handleScreenshotChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, or JPEG).");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert("Image size should be less than 8MB.");
      return;
    }

    setUploadingScreenshot(true);
    setScreenshotFileName(file.name);

    try {
      const reader = new FileReader();
      reader.onload = () => {
        setScreenshotData(reader.result as string);
        setUploadingScreenshot(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Screenshot read error:", err);
      setUploadingScreenshot(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validations
    if (!customerName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 10) {
      setErrorMessage("Please enter a valid Pakistani mobile number (e.g., 0300 1234567).");
      return;
    }
    if (!deliveryAddress.trim()) {
      setErrorMessage("Please enter your complete delivery street address.");
      return;
    }

    const finalCity = city === "Other City / Town" ? customCity.trim() : city;
    if (!finalCity) {
      setErrorMessage("Please specify your city.");
      return;
    }

    if ((paymentMethod === "easypaisa" || paymentMethod === "meezan_bank") && !screenshotData) {
      setErrorMessage("Please upload a screenshot or receipt of your payment before placing the order.");
      return;
    }

    if (items.length === 0) {
      setErrorMessage("Your cart is empty. Please add fabrics before checking out.");
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        deliveryAddress,
        city: finalCity,
        postalCode: postalCode || null,
        orderNotes: orderNotes || null,
        paymentMethod,
        paymentScreenshot: screenshotData || null,
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.effectivePrice,
          quantity: item.quantity,
          image: item.image,
          category: item.category,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to place order. Please try again.");
      }

      // Clear cart
      clearCart();

      // Redirect to Order Confirmation
      router.push(`/order-confirmation/${data.order.orderNumber}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(msg);
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-3xl border border-stone-200 p-12 max-w-md mx-auto">
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">
              Your bag is empty
            </h2>
            <p className="text-xs text-stone-500 mb-6">
              You must have items in your shopping bag before proceeding to checkout.
            </p>
            <Link
              href="/products"
              className="bg-[#B8862B] text-white text-xs font-semibold py-3 px-6 rounded-xl inline-block"
            >
              Browse All Fabrics
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header Breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-xs text-stone-500 mb-2">
            <Link href="/" className="hover:text-[#B8862B]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/cart" className="hover:text-[#B8862B]">Shopping Bag</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-stone-900 font-semibold">Checkout</span>
          </nav>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Secure Checkout
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Complete your delivery details and choose your preferred Pakistani payment method.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-sm animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Please check the form:</p>
              <p className="text-xs mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Customer Details & Payment Options (Left 7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Customer & Delivery Details */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
                <span className="w-8 h-8 rounded-full bg-[#B8862B] text-white flex items-center justify-center font-serif font-bold text-sm">
                  1
                </span>
                <div>
                  <h2 className="font-serif font-bold text-lg text-stone-900">
                    Delivery Address &amp; Contact
                  </h2>
                  <p className="text-xs text-stone-500">
                    We deliver via TCS, Trax, and Leopards Courier across Pakistan.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mian Hamza Tariq"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B8862B] focus:bg-white transition-all"
                  />
                </div>

                {/* Mobile Phone */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Phone / WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0300 1234567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B8862B] focus:bg-white transition-all"
                  />
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    Our team will WhatsApp you for order confirmation.
                  </span>
                </div>

                {/* Email (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B8862B] focus:bg-white transition-all"
                  />
                </div>

                {/* Delivery Street Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Complete Street Address / House / Flat <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="House / Flat #, Street, Sector / Colony, Landmark..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B8862B] focus:bg-white transition-all"
                  />
                </div>

                {/* City Selection */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B8862B] focus:bg-white transition-all"
                  >
                    {PAKISTAN_MAJOR_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {city === "Other City / Town" ? (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Specify City / Tehsil <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sahiwal, Okara..."
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B8862B] focus:bg-white transition-all"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Postal Code <span className="text-stone-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 54000"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B8862B] focus:bg-white transition-all"
                    />
                  </div>
                )}

                {/* Order Notes */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Order Notes / Delivery Instructions <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Please deliver after 2:00 PM, call upon arrival"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B8862B] focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method Selection */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
                <span className="w-8 h-8 rounded-full bg-[#B8862B] text-white flex items-center justify-center font-serif font-bold text-sm">
                  2
                </span>
                <div>
                  <h2 className="font-serif font-bold text-lg text-stone-900">
                    Payment Method
                  </h2>
                  <p className="text-xs text-stone-500">
                    Select manual payment confirmation (Cash on Delivery, EasyPaisa, or Meezan Bank).
                  </p>
                </div>
              </div>

              {/* Payment Method Radio Options */}
              <div className="space-y-3">
                {/* 1. Cash on Delivery */}
                <label
                  className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === "cod"
                      ? "border-[#B8862B] bg-amber-50/40"
                      : "border-stone-200 bg-stone-50/40 hover:bg-stone-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="mt-1 text-[#B8862B] focus:ring-[#B8862B]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-5 h-5 text-[#B8862B]" />
                      <span className="font-bold text-stone-900 text-sm">
                        Cash on Delivery (COD)
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Nationwide
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Pay cash directly to the courier rider upon parcel delivery at your doorstep.
                    </p>
                  </div>
                </label>

                {/* 2. EasyPaisa */}
                <label
                  className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === "easypaisa"
                      ? "border-[#B8862B] bg-amber-50/40"
                      : "border-stone-200 bg-stone-50/40 hover:bg-stone-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="easypaisa"
                    checked={paymentMethod === "easypaisa"}
                    onChange={() => setPaymentMethod("easypaisa")}
                    className="mt-1 text-[#B8862B] focus:ring-[#B8862B]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-emerald-600" />
                      <span className="font-bold text-stone-900 text-sm">
                        EasyPaisa Mobile Account
                      </span>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Instant
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Send payment to our EasyPaisa account and upload the receipt screenshot below.
                    </p>
                  </div>
                </label>

                {/* 3. Meezan Bank Transfer */}
                <label
                  className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === "meezan_bank"
                      ? "border-[#B8862B] bg-amber-50/40"
                      : "border-stone-200 bg-stone-50/40 hover:bg-stone-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="meezan_bank"
                    checked={paymentMethod === "meezan_bank"}
                    onChange={() => setPaymentMethod("meezan_bank")}
                    className="mt-1 text-[#B8862B] focus:ring-[#B8862B]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-blue-700" />
                      <span className="font-bold text-stone-900 text-sm">
                        Meezan Bank Online Transfer / Raast
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Transfer directly via Meezan Internet Banking / 1Link Raast and upload the transfer receipt.
                    </p>
                  </div>
                </label>
              </div>

              {/* Dynamic Payment Details & Screenshot Proof Section for EasyPaisa */}
              {paymentMethod === "easypaisa" && (
                <div className="p-5 bg-stone-900 text-white rounded-2xl space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                    <div>
                      <p className="text-xs text-stone-400">EasyPaisa Account Details:</p>
                      <p className="font-serif font-bold text-base text-[#B8862B]">
                        {settings.easypaisa_title}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-stone-400">Mobile Account Number:</span>
                      <p className="font-mono font-bold text-lg text-emerald-400">
                        {settings.easypaisa_number}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-stone-300">
                    💡 <strong>Instructions:</strong> {settings.easypaisa_instructions}
                  </p>

                  {/* Screenshot Upload Dropzone */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                      Upload EasyPaisa Receipt / Screenshot Proof <span className="text-rose-400">*</span>
                    </label>

                    <div className="border-2 border-dashed border-stone-700 hover:border-[#B8862B] rounded-xl p-4 text-center bg-stone-800/60 transition-colors">
                      {screenshotData ? (
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 text-left">
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-stone-700 shrink-0">
                              <img src={screenshotData} alt="Proof preview" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Screenshot Attached
                              </p>
                              <p className="text-[11px] text-stone-400 truncate max-w-xs">{screenshotFileName || "Receipt.png"}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setScreenshotData(null);
                              setScreenshotFileName(null);
                            }}
                            className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
                          >
                            Change
                          </button>
                        </div>
                      ) : (
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleScreenshotChange}
                            className="hidden"
                            id="easypaisa-screenshot-upload"
                          />
                          <label
                            htmlFor="easypaisa-screenshot-upload"
                            className="cursor-pointer flex flex-col items-center justify-center gap-1.5 py-2"
                          >
                            <Upload className="w-6 h-6 text-[#B8862B]" />
                            <span className="text-xs font-bold text-white">Click to Upload Payment Screenshot</span>
                            <span className="text-[11px] text-stone-400">PNG, JPG, or Screenshot from EasyPaisa App</span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Payment Details & Screenshot Proof Section for Meezan Bank */}
              {paymentMethod === "meezan_bank" && (
                <div className="p-5 bg-stone-900 text-white rounded-2xl space-y-4 animate-in fade-in">
                  <div className="space-y-2 pb-3 border-b border-stone-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-stone-400">Account Title:</p>
                        <p className="font-serif font-bold text-base text-[#B8862B]">
                          {settings.meezan_bank_title}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-stone-400">Bank &amp; Branch:</span>
                        <p className="text-xs font-semibold text-stone-200">
                          {settings.meezan_bank_branch}
                        </p>
                      </div>
                    </div>

                    <div className="bg-stone-800 p-3 rounded-xl space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-stone-400">Account Number:</span>
                        <span className="font-mono font-bold text-white">{settings.meezan_bank_account}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-stone-400">IBAN (For Raast/Interbank):</span>
                        <span className="font-mono font-bold text-emerald-400 text-[11px] sm:text-xs">
                          {settings.meezan_bank_iban}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-300">
                    💡 <strong>Instructions:</strong> {settings.meezan_bank_instructions}
                  </p>

                  {/* Screenshot Upload Dropzone */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                      Upload Bank Transfer Receipt Screenshot <span className="text-rose-400">*</span>
                    </label>

                    <div className="border-2 border-dashed border-stone-700 hover:border-[#B8862B] rounded-xl p-4 text-center bg-stone-800/60 transition-colors">
                      {screenshotData ? (
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 text-left">
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-stone-700 shrink-0">
                              <img src={screenshotData} alt="Proof preview" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Receipt Attached
                              </p>
                              <p className="text-[11px] text-stone-400 truncate max-w-xs">{screenshotFileName || "Receipt.png"}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setScreenshotData(null);
                              setScreenshotFileName(null);
                            }}
                            className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
                          >
                            Change
                          </button>
                        </div>
                      ) : (
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleScreenshotChange}
                            className="hidden"
                            id="bank-screenshot-upload"
                          />
                          <label
                            htmlFor="bank-screenshot-upload"
                            className="cursor-pointer flex flex-col items-center justify-center gap-1.5 py-2"
                          >
                            <Upload className="w-6 h-6 text-[#B8862B]" />
                            <span className="text-xs font-bold text-white">Click to Upload Banking Receipt Screenshot</span>
                            <span className="text-[11px] text-stone-400">PNG, JPG or PDF Screenshot</span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary & Place Order (Right 5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6 sticky top-28">
            <h2 className="font-serif font-bold text-xl text-stone-900 pb-4 border-b border-stone-100">
              Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} items)
            </h2>

            {/* Itemized Mini List */}
            <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-stone-100 pr-1">
              {items.map((item) => (
                <div key={item.productId} className="pt-3 first:pt-0 flex items-center gap-3">
                  <div className="w-14 h-16 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                    <img src={item.image || "/images/hero-banner.jpg"} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-stone-900 truncate">{item.name}</p>
                    <p className="text-[11px] text-stone-500">Qty: {item.quantity} &bull; {formatPKR(item.effectivePrice)}</p>
                  </div>
                  <span className="text-xs font-bold text-stone-900 shrink-0">
                    {formatPKR(item.effectivePrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="border-t border-stone-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping Fee</span>
                <span className="font-semibold">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE Delivery</span>
                  ) : (
                    formatPKR(shippingFee)
                  )}
                </span>
              </div>
              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                <span className="text-base font-bold text-stone-900">Total Payable</span>
                <span className="text-2xl font-bold text-[#B8862B] font-serif">
                  {formatPKR(total)}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || uploadingScreenshot}
                className="w-full bg-[#B8862B] hover:bg-[#9E7422] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Place Order Now ({formatPKR(total)})</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-center text-stone-500">
              🔒 By clicking Place Order, you confirm your order with Daud Fabrics. Our team will verify and contact you on WhatsApp/Phone.
            </p>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
