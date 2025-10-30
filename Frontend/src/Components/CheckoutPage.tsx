import { useLocation, useNavigate } from "react-router-dom";
import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";
import axios from "axios";

interface CheckoutState {
  experience?: {
    title: string;
    price: number;
  };
  selectedDate?: string; // yyyy-mm-dd
  selectedSlot?: string;
  quantity?: number;
  promoCode?: string;
  appliedPromo?: { type: "percentage" | "fixed"; discount: number } | null;
}

const API_BASE = "https://highway-delite-wppr.onrender.com/api";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const checkout = (state || {}) as CheckoutState;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [promoCode, setPromoCode] = useState(checkout.promoCode || "");
  const [appliedPromo, setAppliedPromo] = useState<CheckoutState["appliedPromo"]>(checkout.appliedPromo || null);
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const pricePerUnit = checkout.experience?.price ?? 0;
  const quantity = checkout.quantity ?? 1;
  const subtotal = Math.max(pricePerUnit * quantity, 0);
  const taxes = Math.round(subtotal * 0.06);
  const totalBeforePromo = subtotal + taxes;

  const total = useMemo(() => {
    if (!appliedPromo) return totalBeforePromo;
    if (appliedPromo.type === "percentage") {
      const discounted = Math.round(totalBeforePromo - (totalBeforePromo * appliedPromo.discount) / 100);
      return Math.max(discounted, 0);
    }
    return Math.max(totalBeforePromo - (appliedPromo.discount || 0), 0);
  }, [appliedPromo, totalBeforePromo]);

  const onApplyPromo = async () => {
    if (!promoCode) return;
    try {
      const res = await axios.post(`${API_BASE}/promoValidate`, { promoCode });
      setAppliedPromo({ type: res.data.type, discount: res.data.discount || 0 });
      setMessage("Promo applied successfully!");
    } catch (e: any) {
      setAppliedPromo(null);
      setMessage(e?.response?.data?.message || "Invalid promo code");
    }
  };

  const onPayAndConfirm = async () => {
    if (!checkout.experience?.title || !checkout.selectedDate || !checkout.selectedSlot) return;
    if (!agree) {
      setMessage("Please agree to the terms and safety policy");
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post(`${API_BASE}/bookings`, {
        destination: checkout.experience.title,
        date: checkout.selectedDate,
        timeSlot: checkout.selectedSlot,
        amount: total,
        promoCode: promoCode || null,
      });
      navigate('/ordered', { state: { booking: res.data.booking } });
    } catch (e: any) {
      setMessage(e?.response?.data?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  const dateLabel = checkout.selectedDate ? new Date(checkout.selectedDate).toLocaleDateString() : "";

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <span>Checkout</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <div className="bg-gray-100 rounded-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Full name</label>
              <input value={fullName} onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)} placeholder="Your name" className="w-full bg-white border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input type="email" value={email} onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} placeholder="Your email" className="w-full bg-white border rounded px-3 py-2" />
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Promo code</label>
              <input value={promoCode} onChange={(e: ChangeEvent<HTMLInputElement>) => setPromoCode(e.target.value)} placeholder="Promo code" className="w-full bg-white border rounded px-3 py-2" />
            </div>
            <div className="pt-6">
              <button onClick={onApplyPromo} className="h-[38px] px-4 rounded bg-black text-white">Apply</button>
            </div>
          </div>

          <label className="mt-3 flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
            I agree to the terms and safety policy
          </label>

          {message && <p className="text-sm text-red-500 mt-3">{message}</p>}
        </div>

        <aside className="bg-gray-100 rounded-md p-4 h-fit">
          <div className="flex items-center justify-between py-2 text-sm">
            <span className="text-gray-600">Experience</span>
            <span className="text-gray-800">{checkout.experience?.title}</span>
          </div>
          <div className="flex items-center justify-between py-2 text-sm">
            <span className="text-gray-600">Date</span>
            <span className="text-gray-800">{dateLabel}</span>
          </div>
          <div className="flex items-center justify-between py-2 text-sm">
            <span className="text-gray-600">Time</span>
            <span className="text-gray-800">{checkout.selectedSlot}</span>
          </div>
          <div className="flex items-center justify-between py-2 text-sm">
            <span className="text-gray-600">Qty</span>
            <span className="text-gray-800">{quantity}</span>
          </div>
          <div className="flex items-center justify-between py-2 text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-800">₹{subtotal}</span>
          </div>
          <div className="flex items-center justify-between py-2 text-sm border-t pt-2">
            <span className="text-gray-600">Taxes</span>
            <span className="text-gray-800">₹{taxes}</span>
          </div>
          {appliedPromo && (
            <div className="flex items-center justify-between py-2 text-sm">
              <span className="text-gray-600">Promo ({promoCode?.toUpperCase()})</span>
              <span className="text-green-700">-
                {appliedPromo.type === 'percentage' ? `${appliedPromo.discount}%` : `₹${appliedPromo.discount}`}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between py-3">
            <span className="font-semibold">Total</span>
            <span className="font-semibold">₹{total}</span>
          </div>

          <button disabled={submitting || !agree} onClick={onPayAndConfirm} className={`w-full py-2 rounded ${!agree ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-yellow-500 text-white'}`}>
            {submitting ? 'Processing...' : 'Pay and Confirm'}
          </button>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;


