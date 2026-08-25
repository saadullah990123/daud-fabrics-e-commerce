export function formatPKR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return "Rs 0";
  return `Rs ${amount.toLocaleString("en-PK")}`;
}

export function formatDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "—";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function getOrderStatusBadge(status: string) {
  switch (status?.toLowerCase()) {
    case "pending":
      return {
        label: "Pending",
        bg: "bg-amber-100 text-amber-800 border-amber-300",
        dot: "bg-amber-500",
      };
    case "processing":
      return {
        label: "Processing",
        bg: "bg-blue-100 text-blue-800 border-blue-300",
        dot: "bg-blue-500",
      };
    case "shipped":
      return {
        label: "Shipped",
        bg: "bg-purple-100 text-purple-800 border-purple-300",
        dot: "bg-purple-500",
      };
    case "delivered":
      return {
        label: "Delivered",
        bg: "bg-emerald-100 text-emerald-800 border-emerald-300",
        dot: "bg-emerald-500",
      };
    case "cancelled":
      return {
        label: "Cancelled",
        bg: "bg-rose-100 text-rose-800 border-rose-300",
        dot: "bg-rose-500",
      };
    default:
      return {
        label: status || "Unknown",
        bg: "bg-gray-100 text-gray-800 border-gray-300",
        dot: "bg-gray-400",
      };
  }
}

export function getPaymentStatusBadge(status: string) {
  switch (status?.toLowerCase()) {
    case "paid":
      return {
        label: "Paid",
        bg: "bg-emerald-100 text-emerald-800 border-emerald-300",
      };
    case "pending":
      return {
        label: "Pending Verification",
        bg: "bg-amber-100 text-amber-800 border-amber-300",
      };
    case "cancelled":
    case "failed":
      return {
        label: "Cancelled",
        bg: "bg-rose-100 text-rose-800 border-rose-300",
      };
    case "refunded":
      return {
        label: "Refunded",
        bg: "bg-slate-100 text-slate-800 border-slate-300",
      };
    default:
      return {
        label: status || "Pending",
        bg: "bg-amber-100 text-amber-800 border-amber-300",
      };
  }
}

export function getPaymentMethodName(method: string) {
  switch (method) {
    case "cod":
      return "Cash on Delivery (COD)";
    case "easypaisa":
      return "EasyPaisa Mobile Account";
    case "meezan_bank":
      return "Meezan Bank Online Transfer";
    default:
      return method || "Cash on Delivery";
  }
}

export function getCategoryLabel(category: string) {
  switch (category?.toLowerCase()) {
    case "men":
      return "Men's Collection";
    case "women":
      return "Women's Collection";
    case "kids":
      return "Kids' Collection";
    default:
      return category;
  }
}

export const PAKISTAN_MAJOR_CITIES = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Gujranwala",
  "Sialkot",
  "Quetta",
  "Hyderabad",
  "Bahawalpur",
  "Sargodha",
  "Abbottabad",
  "Gujrat",
  "Wah Cantt",
  "Jhelum",
  "Rahim Yar Khan",
  "Sheikhupura",
  "Mardan",
  "Kasur",
  "Sukkur",
  "Larkana",
  "Mirpur (AJK)",
  "Muzaffarabad",
  "Other City / Town",
];
