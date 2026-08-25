"use client";

import React, { useState, useEffect } from "react";
import {
  KeyRound,
  Lock,
  Banknote,
  Smartphone,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Truck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  ShieldCheck,
} from "lucide-react";

export default function AdminSettingsPage() {
  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMessage, setPwdMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Store Settings State
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [settings, setSettings] = useState({
    easypaisa_title: "Daud Fabrics / Daud Ahmed",
    easypaisa_number: "0300-1234567",
    easypaisa_instructions: "Send payment to the EasyPaisa number above, then upload a screenshot of your transaction receipt.",
    meezan_bank_title: "Daud Fabrics Pvt Ltd",
    meezan_bank_account: "0289-0105829101",
    meezan_bank_iban: "PK65MEZN0002890105829101",
    meezan_bank_branch: "Gulberg III Main Branch, Lahore",
    meezan_bank_instructions: "Transfer the order total to our Meezan Bank account via Raast or Online Banking. Upload your transfer receipt/screenshot proof below.",
    store_phone: "+92 300 1234567",
    store_whatsapp: "923001234567",
    store_email: "sales@daudfabrics.pk",
    store_address: "Shop # 14-18, Daud Fabrics Arcade, Main Liberty Market, Gulberg III, Lahore",
    free_shipping_threshold: "3000",
    standard_shipping_fee: "250",
  });

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings((prev) => ({ ...prev, ...data.settings }));
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setSettingsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMessage(null);

    if (newPassword !== confirmPassword) {
      setPwdMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    if (newPassword.length < 6) {
      setPwdMessage({ type: "error", text: "Password must be at least 6 characters long." });
      return;
    }

    setPwdLoading(true);

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update password.");
      }

      setPwdMessage({ type: "success", text: "Admin password updated successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error changing password.";
      setPwdMessage({ type: "error", text: msg });
    } finally {
      setPwdLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsMessage(null);
    setSavingSettings(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save settings.");
      }

      setSettingsMessage({ type: "success", text: "Store settings & bank details saved successfully!" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving settings.";
      setSettingsMessage({ type: "error", text: msg });
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs uppercase font-bold tracking-wider text-[#B8862B]">
          Administration &amp; Payment Accounts
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Store &amp; Security Settings
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Update administrator password, bank account details for manual transfers, and shipping fees.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Password Management (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
              <div className="p-2.5 bg-amber-50 text-[#B8862B] rounded-xl">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-stone-900">
                  Change Admin Password
                </h2>
                <p className="text-xs text-stone-500">
                  Update your personal login password.
                </p>
              </div>
            </div>

            {pwdMessage && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-start gap-2 ${
                  pwdMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {pwdMessage.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{pwdMessage.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="password"
                    required
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B8862B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B8862B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="password"
                    required
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B8862B]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={pwdLoading}
                  className="w-full bg-[#1A1A1A] hover:bg-[#B8862B] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50"
                >
                  {pwdLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Bank Details & Store Information (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSaveSettings} className="space-y-6">
            {settingsMessage && (
              <div
                className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
                  settingsMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{settingsMessage.text}</span>
              </div>
            )}

            {/* EasyPaisa Settings */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    EasyPaisa Payment Account
                  </h3>
                  <p className="text-xs text-stone-500">
                    Shown to customers at checkout for manual EasyPaisa transfers.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    EasyPaisa Account Title
                  </label>
                  <input
                    type="text"
                    value={settings.easypaisa_title}
                    onChange={(e) => setSettings({ ...settings, easypaisa_title: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-1 focus:ring-[#B8862B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    EasyPaisa Mobile Number
                  </label>
                  <input
                    type="text"
                    value={settings.easypaisa_number}
                    onChange={(e) => setSettings({ ...settings, easypaisa_number: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-hidden focus:ring-1 focus:ring-[#B8862B]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Instructions Displayed to Customer
                  </label>
                  <input
                    type="text"
                    value={settings.easypaisa_instructions}
                    onChange={(e) => setSettings({ ...settings, easypaisa_instructions: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-1 focus:ring-[#B8862B]"
                  />
                </div>
              </div>
            </div>

            {/* Meezan Bank Settings */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    Meezan Bank Account &amp; IBAN
                  </h3>
                  <p className="text-xs text-stone-500">
                    Used for online banking transfers, 1Link Raast, and ATM deposits.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Bank Account Title
                  </label>
                  <input
                    type="text"
                    value={settings.meezan_bank_title}
                    onChange={(e) => setSettings({ ...settings, meezan_bank_title: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-1 focus:ring-[#B8862B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={settings.meezan_bank_account}
                    onChange={(e) => setSettings({ ...settings, meezan_bank_account: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-hidden focus:ring-1 focus:ring-[#B8862B]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Meezan Bank IBAN (24 Characters)
                  </label>
                  <input
                    type="text"
                    value={settings.meezan_bank_iban}
                    onChange={(e) => setSettings({ ...settings, meezan_bank_iban: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-hidden focus:ring-1 focus:ring-[#B8862B]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Bank Branch Name &amp; City
                  </label>
                  <input
                    type="text"
                    value={settings.meezan_bank_branch}
                    onChange={(e) => setSettings({ ...settings, meezan_bank_branch: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-1 focus:ring-[#B8862B]"
                  />
                </div>
              </div>
            </div>

            {/* Shipping & Contact Settings */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                <div className="p-2 bg-stone-100 text-stone-800 rounded-xl">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    Shipping &amp; Helpline Contact
                  </h3>
                  <p className="text-xs text-stone-500">
                    Configure free shipping thresholds and store details.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Free Shipping Threshold (PKR)
                  </label>
                  <input
                    type="number"
                    value={settings.free_shipping_threshold}
                    onChange={(e) => setSettings({ ...settings, free_shipping_threshold: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-1 focus:ring-[#B8862B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Standard Shipping Fee (PKR)
                  </label>
                  <input
                    type="number"
                    value={settings.standard_shipping_fee}
                    onChange={(e) => setSettings({ ...settings, standard_shipping_fee: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-1 focus:ring-[#B8862B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Store Helpline Phone
                  </label>
                  <input
                    type="text"
                    value={settings.store_phone}
                    onChange={(e) => setSettings({ ...settings, store_phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-1 focus:ring-[#B8862B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    WhatsApp Support Number
                  </label>
                  <input
                    type="text"
                    value={settings.store_whatsapp}
                    onChange={(e) => setSettings({ ...settings, store_whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-1 focus:ring-[#B8862B]"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingSettings}
                className="bg-[#B8862B] hover:bg-[#9E7422] text-white font-bold py-3 px-8 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-md disabled:opacity-50"
              >
                {savingSettings ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Settings...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save All Store Settings</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
