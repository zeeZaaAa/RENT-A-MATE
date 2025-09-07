export default function MateProfile({ mateData }) {
  if (!mateData) {
    return (
      <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md">
        <div className="w-[100px] h-[100px] rounded-full bg-emerald-100 animate-pulse" />
        <div className="flex flex-col gap-2">
          <div className="w-32 h-4 bg-emerald-100 rounded animate-pulse" />
          <div className="w-24 h-4 bg-emerald-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
      {/* Profile Picture */}
      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-emerald-500 shadow-md flex-shrink-0">
        <img
          src={mateData.pic?.secure_url}
          alt={`${mateData.name || ""} ${mateData.surName || ""}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col text-center sm:text-left">
        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 text-xl font-bold text-emerald-700">
          <p>{mateData.name}</p>
          <p>{mateData.surName}</p>
          {mateData.nickname && (
            <span className="text-gray-500 font-medium">
              ({mateData.nickname})
            </span>
          )}
        </div>

        <p className="mt-2 text-gray-600 text-sm sm:text-base max-w-md break-words">
          {mateData.introduce || "No introduction yet."}
        </p>
      </div>
    </div>
  );
}
