import { useLocation, Link } from "react-router-dom";

interface BookingState {
  booking?: {
    destination: string;
    date: string;
    timeSlot: string;
    amount: number;
    promoCode?: string | null;
  };
}

const Ordered: React.FC = () => {
  const location = useLocation();
  const state = (location.state || {}) as BookingState;
  const booking = state.booking;

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto p-24 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-600 mx-auto flex items-center justify-center mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <h1 className="text-2xl font-semibold mb-2">Booking Confirmed</h1>
        <p className="text-gray-600 mb-6">Ref ID: —</p>
        <Link to="/" className="px-4 py-2 rounded bg-gray-200 text-gray-800">Back to Home</Link>
      </div>
    );
  }

  const refId = (booking as any)?._id
    ? String((booking as any)._id).slice(-6).toUpperCase()
    : Math.random().toString(36).slice(2, 8).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto p-24 text-center">
      <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-600 mx-auto flex items-center justify-center mb-6">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
      </div>
      <h1 className="text-2xl font-semibold mb-2">Booking Confirmed</h1>
      <p className="text-gray-600 mb-6">Ref ID: {refId}</p>
      <Link to="/" className="px-4 py-2 rounded bg-gray-200 text-gray-800">Back to Home</Link>
    </div>
  );
}

export default Ordered;


