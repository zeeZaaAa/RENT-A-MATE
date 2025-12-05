import { IoHome } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function MateDetail({ mateProfile }) {
  const navigate = useNavigate();

  const formatAvailableDate = (date) => {
    switch (date) {
      case "weekdays":
        return "Weekdays (Mon-Fri)";
      case "weekends":
        return "Weekends (Sat-Sun)";
      case "all":
      default:
        return "All Days";
    }
  };

  const formatAvailableTime = (timeArray) => {
    if (!timeArray || timeArray.length !== 2) return "Not available";
    return `${timeArray[0]} - ${timeArray[1]}`;
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      {/* Back button */}
      <div className="flex items-center space-x-3 mb-6">
        <button
          onClick={() => navigate("/renter")}
          className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-transform hover:scale-110"
        >
          <IoHome size={22} />
        </button>
        <h2 className="text-xl md:text-2xl font-semibold text-blue-700">
          You're renting: {mateProfile.name} {mateProfile.surName}
        </h2>
      </div>

      {/* Card */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-blue-100">
        <div className="flex flex-col md:flex-row items-center md:items-start p-6 gap-6">
          {/* Profile image */}
          <div className="flex-shrink-0 w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200">
            <img
              src={mateProfile.pic.secure_url}
              alt={`${mateProfile.name} ${mateProfile.surName}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Profile details */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div>
              <p className="text-sm text-gray-500">Interest</p>
              <p className="font-medium">{mateProfile.interest}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Skill</p>
              <p className="font-medium">{mateProfile.skill}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Review Rate</p>
              <p className="font-medium text-blue-600">
                {mateProfile.review_rate
                  ? `${mateProfile.review_rate} ⭐`
                  : "No reviews yet"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="font-medium text-blue-600">
                {mateProfile.price_rate} / hour
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Available Date & Time</p>
              <p className="font-medium">
                {formatAvailableDate(mateProfile.avaliable_date)},{" "}
                {formatAvailableTime(mateProfile.avaliable_time)}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Introduce</p>
              <p className="font-medium leading-relaxed">
                {mateProfile.introduce}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
