import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    destination: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    promoCode: {
      type: String,
      default: null,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
