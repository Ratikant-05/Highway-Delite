import { useEffect, useState } from "react";
 
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface Experience {
  _id: string;
  title: string;
  about: string;
  image: string;
  price: number;
  timeSlots: string[];
}

interface Booking {
  destination: string;
  date: string;
  timeSlot: string;
  amount: number;
}

interface ExperienceDetailsResponse {
  experience: Experience;
  availableSlots: string[];
}

 


const DetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  
  const [cart] = useState<Booking | null>(null);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  

  const API_BASE = "https://highway-delite-wppr.onrender.com/api";

  useEffect(() => {
    if (!id) return;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get<ExperienceDetailsResponse>(`${API_BASE}/experiences/${id}`);
        const exp = res.data?.experience;
        if (exp) {
          setExperience(exp);
          setAvailableSlots(res.data.availableSlots || []);
        } else {
          setMessage("Experience not found");
        }
      } catch (error) {
        console.error(error);
        setMessage("Failed to fetch experience details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  

  const handleBooking = async () => {
    if (!selectedSlot || !selectedDate || !experience) {
      setMessage("Please select date and time slot");
      return;
    }
    navigate('/checkoutPage', {
      state: {
        experience: { title: experience.title, price: experience.price },
        selectedDate,
        selectedSlot,
        quantity,
      }
    });
  };

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;
  if (!experience) return <div className="text-center mt-10 text-lg">{message || "Not found"}</div>;

  const pricePerUnit = experience.price || 0;
  const subtotal = Math.max(pricePerUnit * quantity, 0);
  const taxes = Math.round(subtotal * 0.06);
  const total = subtotal + taxes;

  const today = new Date();
  const nextDays = Array.from({ length: 5 }).map((_, idx) => {
    const d = new Date(today);
    d.setDate(today.getDate() + idx);
    return d;
  });

  const defaultSlots = [
    "07:00 am",
    "09:00 am",
    "11:00 am",
    "1:00 pm",
    "3:00 pm",
  ];

  const allSlots = (experience.timeSlots && experience.timeSlots.length > 0)
    ? experience.timeSlots
    : defaultSlots;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <span>Details</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <div>
          <div className="rounded overflow-hidden mb-6">
            <img
              src={experience.image?.startsWith("http") ? experience.image : `https://highway-delite-wppr.onrender.com${experience.image}`}
              alt={experience.title}
              className="w-[800px] max-h-[460px] object-cover"
            />
          </div>

          <h1 className="text-2xl font-semibold mb-2">{experience.title}</h1>
          <p className="text-gray-600 mb-8">{experience.about}</p>

          <div className="mb-6">
            <p className="font-medium mb-2">Choose date</p>
            <div className="flex flex-wrap gap-2">
              {nextDays.map((d, idx) => {
                const value = d.toISOString().slice(0, 10);
                const label = d.toLocaleDateString(undefined, { month: 'short', day: '2-digit' });
                const active = selectedDate === value;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(value)}
                    className={`${active ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'} px-3 py-2 rounded text-sm`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mb-2">
            <p className="font-medium mb-2">Choose time</p>
            <div className="flex flex-wrap gap-2">
              {allSlots.map((slot, i) => {
                // Allow booking the same time slot across different experiences.
                // We deliberately treat all slots as available here.
                const isAvailable = true || (Array.isArray(availableSlots) && availableSlots.includes(slot));
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={i}
                    onClick={() => isAvailable && setSelectedSlot(slot)}
                    disabled={!isAvailable}
                    className={`${isSelected ? 'ring-2 ring-black' : ''} ${isAvailable ? 'bg-gray-100 text-gray-900 hover:bg-gray-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'} px-3 py-2 rounded text-sm`}
                    title={isAvailable ? 'Available' : 'Sold out'}
                  >
                    {slot} {!isAvailable && <span className="ml-1 text-xs text-gray-400">Sold out</span>}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-gray-400 mt-3">All times are in IST (GMT +5:30)</p>
          </div>

          <div className="mt-8">
            <p className="font-medium mb-2">About</p>
            <div className="bg-gray-100 rounded p-3 text-sm text-gray-700">
              Scenic routes, trained guides, and safety briefing. Minimum age 10.
            </div>
          </div>

          {message && <p className="mt-4 text-red-500">{message}</p>}
          {cart && (
            <div className="mt-4 text-sm text-gray-600">
              <p>Booked: {cart.destination} • {new Date(cart.date).toLocaleDateString()} • {cart.timeSlot}</p>
            </div>
          )}
        </div>

        <aside className="bg-gray-100 rounded-md p-4 h-fit">
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-600">Starts at</span>
            <span className="font-medium">₹{pricePerUnit}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-600">Quantity</span>
            <div className="flex items-center gap-3">
              <button
                aria-label="decrease"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-7 h-7 rounded border flex items-center justify-center"
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                aria-label="increase"
                onClick={() => setQuantity(q => q + 1)}
                className="w-7 h-7 rounded border flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-700">₹{subtotal}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-t pt-2">
            <span className="text-gray-600">Taxes</span>
            <span className="text-gray-700">₹{taxes}</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="font-semibold">Total</span>
            <span className="font-semibold">₹{total}</span>
          </div>

          <button
            onClick={handleBooking}
            disabled={!selectedDate || !selectedSlot}
            className={`w-full py-2 rounded ${!selectedDate || !selectedSlot ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-black text-white'}`}
          >
            Confirm
          </button>

          
        </aside>
      </div>
    </div>
  );
};

export default DetailsPage;
