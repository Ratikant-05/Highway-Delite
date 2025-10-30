import Experience from '../Models/experienceModel.js';
import Booking from "../Models/bookingModel.js";

export const addExperiencesController = async (req, res) => {
  try {
    const { title, location, content, price, about } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    if (!title || !location || !content || !price || !about || !image) {
      return res.status(400).json({ message: "All fields and image are required" });
    }

    const newExperience = new Experience({ title, location, content, price, about, image });
    const savedExperience = await newExperience.save();

    res.status(201).json({ message: "Experience created successfully", data: savedExperience });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getExperiencesController = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ createdAt: -1 });
    if (!experiences.length) return res.status(404).json({ message: "No experiences found" });

    res.status(200).json({ message: "Experiences fetched successfully", data: experiences });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const experiencesDetailsController = async (req, res) => {
  try {
    const { id } = req.params;
    const experience = await Experience.findById(id);
    if (!experience) return res.status(404).json({ message: "Experience not found" });

    const allTimeSlots = Array.isArray(experience.timeSlots) ? experience.timeSlots : [];
    const bookedSlots = await Booking.find({ destination: experience.title })
      .select("timeSlot date -_id");

    const today = new Date();
    const futureBookedSlots = bookedSlots
      .filter(b => new Date(b.date) >= today)
      .map(b => b.timeSlot);

    const availableSlots = allTimeSlots.filter(slot => !futureBookedSlots.includes(slot));

    res.status(200).json({ experience, availableSlots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const bookingsController = async (req, res) => {
  try {
    const { destination, date, timeSlot, amount, promoCode } = req.body;
    if (!destination || !date || !timeSlot || !amount) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const existingBooking = await Booking.findOne({ date, timeSlot });
    if (existingBooking) return res.status(400).json({ message: "This time slot is already booked" });

    let finalAmount = amount;
    if (promoCode) {
      const promos = {
        SAVE10: { type: "percentage", discount: 10 },
        FLAT100: { type: "fixed", discount: 100 },
      };

      const promo = promos[promoCode.toUpperCase()];
      if (!promo) return res.status(400).json({ message: "Invalid promo code" });

      finalAmount = promo.type === "percentage" ? amount - (amount * promo.discount) / 100 : amount - promo.discount;
      if (finalAmount < 0) finalAmount = 0;
    }

    const newBooking = new Booking({ destination, date, timeSlot, amount: finalAmount, promoCode: promoCode || null });
    await newBooking.save();

    res.status(201).json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const promoValidateController = async (req, res) => {
  try {
    const { promoCode } = req.body;
    if (!promoCode) return res.status(400).json({ message: "Promo code is required" });

    const promos = {
      SAVE10: { type: "percentage", discount: 10 },
      FLAT100: { type: "fixed", discount: 100 },
    };

    const promo = promos[promoCode.toUpperCase()];
    if (!promo) return res.status(404).json({ message: "Invalid promo code" });

    res.status(200).json({ message: "Promo code is valid", discount: promo.discount, type: promo.type });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
