"use client";

import React, { useState, useEffect } from "react";
import { formatPKR } from "@/lib/format";
import { ProductItem } from "@/lib/types";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  Sparkles,
  Check,
  X,
  Upload,
  AlertCircle,
  Loader2,
  Eye,
  SlidersHorizontal,
  Tag,
  CheckCircle2,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Add / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"men" | "women" | "kids">("men");
  const [subcategory, setSubcategory] = useState("Unstitched Cotton");
  const [customSubcategory, setCustomSubcategory] = useState("");
  const [price, setPrice] = useState<string>("");
  const [salePrice, setSalePrice] = useState<string>("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [stock, setStock] = useState<string>("10");
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);

  // Pre-defined fabric subcategory suggestions per section
  const subcategoryPresets = {
    men: [
      "Unstitched Cotton",
      "Egyptian Cotton Latha",
      "Pure Boski",
      "Wash & Wear",
      "Karandi",
      "Kurta Fabric",
      "Winter Khaddar",
    ],
    women: [
      "3-Piece Lawn",
      "Silk Jacquard",
      "Chikan Kari",
      "Organza Formal",
      "Swiss Voile",
      "2-Piece Printed",
      "Embroidered Chiffon",
    ],
    kids: [
      "Boys Kurta",
      "Boys Festive",
      "Girls Lawn",
      "Kids Cotton Suit",
    ],
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Failed to fetch admin products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setName("");
    setCategory("men");
    setSubcategory("Egyptian Cotton Latha");
    setCustomSubcategory("");
    setPrice("");
    setSalePrice("");
    setDescription("");
    setDetails("Fabric: 100% Egyptian Combed Cotton\nCutting: 4.5 Meters\nWidth: 54 Inches (Bara Arz)\nFinish: Royal Crisp Fall\nSeason: Spring / Summer");
    setStock("15");
    setImages([
      "https://images.pexels.com/photos/8565662/pexels-photo-8565662.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    ]);
    setIsActive(true);
    setIsFeatured(false);
    setIsBestseller(false);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (product: ProductItem) => {
    setEditingProduct(product);
    setName(product.name);
    setCategory(product.category);

    const presets = subcategoryPresets[product.category] || [];
    if (presets.includes(product.subcategory || "")) {
      setSubcategory(product.subcategory || presets[0] || "Custom");
      setCustomSubcategory("");
    } else {
      setSubcategory("Custom");
      setCustomSubcategory(product.subcategory || "");
    }

    setPrice(String(product.price));
    setSalePrice(product.salePrice ? String(product.salePrice) : "");
    setDescription(product.description);
    setDetails(product.details || "");
    setStock(String(product.stock));
    setImages(product.images || []);
    setIsActive(product.isActive);
    setIsFeatured(product.isFeatured);
    setIsBestseller(product.isBestseller);
    setFormError(null);
    setModalOpen(true);
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setImages([...images, newImageUrl.trim()]);
    setNewImageUrl("");
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImages([...images, base64]);
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || !price || !description.trim()) {
      setFormError("Please fill in Product Name, Price, and Fabric Description.");
      return;
    }

    const finalSubcategory = subcategory === "Custom" ? customSubcategory.trim() : subcategory;
    if (!finalSubcategory) {
      setFormError("Please specify a fabric subcategory (e.g. Cotton Latha, Wash & Wear, Silk Jacquard).");
      return;
    }

    if (images.length === 0) {
      setFormError("Please add at least one product photo.");
      return;
    }

    setFormSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        category,
        subcategory: finalSubcategory,
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : null,
        description: description.trim(),
        details: details.trim() || null,
        stock: Number(stock) || 0,
        images,
        isActive,
        isFeatured,
        isBestseller,
      };

      let res;
      if (editingProduct) {
        res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save product");
      }

      setModalOpen(false);
      setToastMessage(editingProduct ? "Product updated successfully!" : "New product created and live in catalog!");
      setTimeout(() => setToastMessage(null), 3000);
      fetchProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving product";
      setFormError(msg);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setDeleteConfirmId(null);
        setToastMessage("Product deleted from catalog.");
        setTimeout(() => setToastMessage(null), 3000);
        fetchProducts();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleToggleActive = async (product: ProductItem) => {
    try {
      await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      fetchProducts();
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  // Filtered Products List
  const filteredProducts = products.filter((p) => {
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      return (
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.subcategory?.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-stone-900 text-white border border-[#B8862B] px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#B8862B]">
            Catalog &amp; Fabric Categories
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Products &amp; Inventory
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Add new fabrics, assign specific fabric categories (Cotton Latha, Wash &amp; Wear, Boski, Lawn), edit prices, and manage stock.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-[#B8862B] hover:bg-[#9E7422] text-white text-xs font-bold py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Fabric Item</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search fabrics (e.g. Cotton, Wash & Wear, Boski)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-1 focus:ring-[#B8862B]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {["all", "men", "women", "kids"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                categoryFilter === cat
                  ? "bg-stone-900 text-white shadow-xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {cat === "all" ? "All Sections" : `${cat}'s section`}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Product</th>
                <th className="py-3.5 px-4">Section &amp; Fabric Type</th>
                <th className="py-3.5 px-4">Regular Price</th>
                <th className="py-3.5 px-4">Sale Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Visibility</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-stone-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#B8862B]" />
                    <span>Loading products inventory...</span>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-stone-400">
                    No fabrics found in this section. Click &quot;Add New Fabric Item&quot; above.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const firstImg = p.images && p.images.length > 0 ? p.images[0] : "/images/hero-banner.jpg";
                  return (
                    <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-14 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                            <img src={firstImg} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-stone-900 truncate max-w-xs">{p.name}</p>
                            <p className="text-[11px] text-stone-400 truncate max-w-xs">{p.description}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <span className="capitalize font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded-md text-[10px]">
                            {p.category}
                          </span>
                          {p.subcategory && (
                            <span className="block text-[11px] font-semibold text-[#B8862B]">
                              {p.subcategory}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 font-bold text-stone-900">
                        {formatPKR(p.price)}
                      </td>

                      <td className="py-4 px-4">
                        {p.salePrice && p.salePrice > 0 ? (
                          <span className="text-[#B8862B] font-bold">
                            {formatPKR(p.salePrice)}
                          </span>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`font-bold px-2.5 py-1 rounded-md text-[11px] ${
                            p.stock <= 0
                              ? "bg-rose-100 text-rose-800"
                              : p.stock <= 4
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {p.stock <= 0 ? "Out of Stock" : `${p.stock} units`}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleActive(p)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                            p.isActive
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-stone-200 text-stone-600 hover:bg-stone-300"
                          }`}
                        >
                          {p.isActive ? "Active (Visible)" : "Hidden"}
                        </button>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-2 text-stone-600 hover:text-[#B8862B] hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit Fabric Details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Delete This Fabric Item?
            </h3>
            <p className="text-xs text-stone-500">
              Are you sure you want to permanently delete this fabric from your store? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 py-2.5 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-xs font-semibold"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h2 className="font-serif font-bold text-xl text-stone-900">
                  {editingProduct ? "Update Fabric Item" : "Add New Fabric Item"}
                </h2>
                <p className="text-xs text-stone-500">
                  Specify the Section (Men/Women/Kids), specific fabric category (Cotton, Wash &amp; Wear, Boski), pricing and inventory.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Product / Fabric Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Executive Wash & Wear Wrinkle-Free Suit — Navy Blue"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B8862B]"
                />
              </div>

              {/* Section & Fabric Subcategory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Store Section <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      const newCat = e.target.value as "men" | "women" | "kids";
                      setCategory(newCat);
                      setSubcategory(subcategoryPresets[newCat][0] || "Custom");
                    }}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B8862B]"
                  >
                    <option value="men">Men&apos;s Section</option>
                    <option value="women">Women&apos;s Section</option>
                    <option value="kids">Kids&apos; Section</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Fabric Category / Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B8862B]"
                  >
                    {subcategoryPresets[category]?.map((preset) => (
                      <option key={preset} value={preset}>
                        {preset}
                      </option>
                    ))}
                    <option value="Custom">+ Custom Fabric Category...</option>
                  </select>
                </div>

                {subcategory === "Custom" && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Enter Custom Fabric Type Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Premium Italian Linen, Khaddar, Boski Blend"
                      value={customSubcategory}
                      onChange={(e) => setCustomSubcategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B8862B]"
                    />
                  </div>
                )}
              </div>

              {/* Pricing in PKR */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Regular Price (PKR) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 4500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B8862B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Sale Price (PKR) <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 3850"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B8862B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Stock Quantity <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 25"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B8862B]"
                  />
                </div>
              </div>

              {/* Quality / Fabric Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Quality / Fabric Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Engineered micro-fiber blend with anti-crease technology, zero ironing hassle, and featherlight feel..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B8862B]"
                />
              </div>

              {/* Cutting & Specifications */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Cutting &amp; Detailed Specifications
                </label>
                <textarea
                  rows={3}
                  placeholder="Fabric: Micro-Poly Viscose Luxury Blend&#10;Cutting: 4.25 Meters&#10;Width: 54 Inches&#10;Properties: Wrinkle-Resistant, Color-Fast"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-[#B8862B]"
                />
              </div>

              {/* Images Manager */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Product Images (Multiple Allowed) <span className="text-rose-500">*</span>
                </label>

                <div className="flex flex-wrap gap-3 mb-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-24 rounded-xl overflow-hidden border border-stone-200 group">
                      <img src={img} alt="Product" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Paste image URL (https://...)"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="bg-stone-800 text-white text-xs px-4 py-2 rounded-xl font-semibold hover:bg-black"
                  >
                    Add URL
                  </button>
                  <label className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs px-4 py-2 rounded-xl font-semibold cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload File</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Visibility & Badges Toggles */}
              <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-6 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-800">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded-sm text-[#B8862B] focus:ring-[#B8862B]"
                  />
                  <span>Active in Store</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-800">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded-sm text-[#B8862B] focus:ring-[#B8862B]"
                  />
                  <span>Featured Product</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-800">
                  <input
                    type="checkbox"
                    checked={isBestseller}
                    onChange={(e) => setIsBestseller(e.target.checked)}
                    className="rounded-sm text-[#B8862B] focus:ring-[#B8862B]"
                  />
                  <span>Bestseller Tag</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 py-2.5 px-5 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="bg-[#B8862B] hover:bg-[#9E7422] text-white py-2.5 px-6 rounded-xl text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
                >
                  {formSubmitting ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
