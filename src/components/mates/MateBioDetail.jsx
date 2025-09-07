export default function MateBioDetail({ mateData }) {
  if (!mateData) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md">
        <p className="text-gray-500 animate-pulse">Loading bio details...</p>
      </div>
    );
  }

  const formatTime = (timeArray) => {
    if (!Array.isArray(timeArray) || timeArray.length !== 2)
      return "Not available";
    const [start, end] = timeArray;
    if (!start || !end) return "Not available";
    return `${start} – ${end}`;
  };

  const renderDetail = (label, value) => (
    <div className="flex flex-col">
      <p className="font-semibold text-emerald-600">{label}</p>
      <p className="text-gray-700">{value || "Not specified"}</p>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-emerald-700 mb-4">Details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
        {renderDetail(
          "Skill",
          Array.isArray(mateData.skill)
            ? mateData.skill.join(", ")
            : mateData.skill
        )}
        {renderDetail(
          "Interest",
          Array.isArray(mateData.interest)
            ? mateData.interest.join(", ")
            : mateData.interest
        )}
        {renderDetail("City", mateData.city)}
        {renderDetail(
          "Price Rate",
          mateData.price_rate ? `${mateData.price_rate} ฿/hr` : "N/A"
        )}
        {renderDetail("Available Date", mateData.avaliable_date)}
        {renderDetail(
          "Available Time",
          <span className="inline-block p-1 rounded-full text-sm">
            {formatTime(mateData.avaliable_time)}
          </span>
        )}
        {renderDetail(
          "Review Rate",
          mateData.review_rate
            ? `${mateData.review_rate} / 5 ⭐`
            : "No reviews yet"
        )}
      </div>
    </div>
  );
}
