import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  activity: String,
  location: String,
  duration: String,
  cost:     String,
  tip:      String,
}, { _id: false });

const MealSchema = new mongoose.Schema({
  restaurant: String,
  dish:       String,
  cuisine:    String,
  priceRange: String,
  address:    String,
}, { _id: false });

const StaySchema = new mongoose.Schema({
  name:          String,
  type:          String,
  area:          String,
  pricePerNight: String,
  rating:        String,
}, { _id: false });

const DaySchema = new mongoose.Schema({
  day:              Number,
  date:             String,
  theme:            String,
  morning:          ActivitySchema,
  afternoon:        ActivitySchema,
  evening:          ActivitySchema,
  lunch:            MealSchema,
  dinner:           MealSchema,
  stay:             StaySchema,
  estimatedDayCost: String,
  highlights:       [String],
}, { _id: false });

const ItinerarySchema = new mongoose.Schema(
  {
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      index:    true,
    },
    destination: {
      type:     String,
      required: true,
      trim:     true,
    },
    summary:         String,
    totalDays:       Number,
    bestTimeToVisit: String,
    weatherNote:     String,

    budgetBreakdown: {
      accommodation: String,
      food:          String,
      activities:    String,
      transport:     String,
    },

    days: [DaySchema],

    localTips:    [String],
    packingTips:  [String],

    emergencyInfo: {
      emergency: String,
      hospital:  String,
      embassy:   String,
    },

    inputs: {
      startDate:   String,
      endDate:     String,
      budget:      String,
      travelers:   String,
      style:       String,
      preferences: String,
    },

    isPublic: {
      type:    Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Itinerary = mongoose.models.Itinerary || mongoose.model('Itinerary', ItinerarySchema);

export default Itinerary;
