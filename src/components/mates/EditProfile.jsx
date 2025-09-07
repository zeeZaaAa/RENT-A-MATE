import { useState, useEffect } from "react";
import ProfileUploader from "../profile/ProfileUploader";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import api from "../../api/apiClient";

export default function EditProfile({ onBack, mateData, setMateData }) {
  const [formData, setFormData] = useState(mateData || {});
  const [cities, setCities] = useState([]);
  const [hours, setHours] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    console.log("Initial pic:", formData.pic);
  }, []);

  useEffect(() => {
    if (mateData) setFormData(mateData);
  }, [mateData]);

  useEffect(() => {
    // Fetch cities
    api.get("/search/cities").then((res) => setCities(res.data));

    // Generate hours
    const h = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, "0") + ":00";
      h.push(hour);
    }
    setHours(h);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error on change
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.introduce?.trim()) {
      newErrors.introduce = "Introduce is required";
    } else if (formData.introduce.length > 50) {
      newErrors.introduce = "Introduce must be at most 250 characters";
    }
    if (!formData.skill) newErrors.skill = "Skill is required";
    if (!formData.interest) newErrors.interest = "Interest is required";
    if (!formData.city) newErrors.city = "City is required";

    // Price rate: positive integer
    const price = parseInt(formData.price_rate, 10);
    if (!price || price <= 0 || !/^\d+$/.test(formData.price_rate))
      newErrors.price_rate = "Price rate must be a positive integer";

    if (!formData.avaliable_date)
      newErrors.avaliable_date = "Available date is required";

    // Time validation
    const start = formData.avaliable_time?.[0];
    const end = formData.avaliable_time?.[1];
    if (!start || !end) {
      newErrors.avaliable_time = "Start and end time are required";
    } else {
      const startIndex = hours.indexOf(start);
      const endIndex = hours.indexOf(end);
      if (startIndex >= endIndex)
        newErrors.avaliable_time = "End time must be after start time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      console.log(formData);
      const res = await api.put("/mate/me", formData);
      setMateData(res.data.data);
      if (onBack) onBack();
    } catch (err) {
      console.error("Update error:", err);

      if (err.response?.status === 400 && err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert("Update failed: " + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col items-center py-6 px-4 md:px-8">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 md:p-8 relative">
        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="absolute top-4 left-4 text-emerald-600 hover:text-emerald-800 transition"
        >
          <IoArrowBackCircleSharp size={32} />
        </button>

        <h1 className="text-2xl font-bold text-emerald-700 mb-6 text-center">
          Edit Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <ProfileUploader
              initialImage={formData.pic?.secure_url}
              onUploadSuccess={(pic) => {
                setFormData((prev) => ({ ...prev, pic }));
                setMateData((prev) => ({ ...prev, pic }));
              }}
            />
          </div>

          {/* Nickname */}
          <div>
            <label className="block text-sm font-semibold text-emerald-700">
              Nickname
            </label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname || ""}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            />
          </div>

          {/* Introduce */}
          <div>
            <label className="block text-sm font-semibold text-emerald-700">
              Introduce Yourself
            </label>
            <textarea
              name="introduce"
              value={formData.introduce || ""}
              onChange={handleChange}
              rows="3"
              maxLength={50}
              className={`w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none ${
                errors.introduce ? "border-red-500" : ""
              }`}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{formData.introduce?.length || 0}/50</span>
              {errors.introduce && (
                <span className="text-red-500">{errors.introduce}</span>
              )}
            </div>
            {errors.introduce && (
              <p className="text-red-500 text-sm mt-1">{errors.introduce}</p>
            )}
          </div>

          {/* Skill / Interest / City / Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-emerald-700">
                Skill
              </label>
              <input
                type="text"
                name="skill"
                value={formData.skill || ""}
                onChange={handleChange}
                className={`w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none ${
                  errors.skill ? "border-red-500" : ""
                }`}
              />
              {errors.skill && (
                <p className="text-red-500 text-sm mt-1">{errors.skill}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-emerald-700">
                Interest
              </label>
              <input
                type="text"
                name="interest"
                value={formData.interest || ""}
                onChange={handleChange}
                className={`w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none ${
                  errors.interest ? "border-red-500" : ""
                }`}
              />
              {errors.interest && (
                <p className="text-red-500 text-sm mt-1">{errors.interest}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-emerald-700 mb-1">
                City
              </label>
              <select
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
                className={`border rounded-lg p-2 w-full ${
                  errors.city ? "border-red-500" : ""
                }`}
              >
                <option value="">-- Select City --</option>
                {cities.map((city, idx) => (
                  <option key={idx} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-emerald-700">
                Price Rate (฿/hr)
              </label>
              <input
                type="number"
                name="price_rate"
                value={formData.price_rate || ""}
                onChange={handleChange}
                className={`w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none ${
                  errors.price_rate ? "border-red-500" : ""
                }`}
              />
              {errors.price_rate && (
                <p className="text-red-500 text-sm mt-1">{errors.price_rate}</p>
              )}
            </div>
          </div>

          {/* Available Date */}
          <div>
            <label className="block text-sm font-semibold text-emerald-700">
              Available Date
            </label>
            <select
              name="avaliable_date"
              value={formData.avaliable_date || ""}
              onChange={handleChange}
              className={`w-full mt-1 p-2 border rounded-lg ${
                errors.avaliable_date ? "border-red-500" : ""
              }`}
            >
              <option value="">Select</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekends">Weekends</option>
              <option value="all">All</option>
            </select>
            {errors.avaliable_date && (
              <p className="text-red-500 text-sm mt-1">
                {errors.avaliable_date}
              </p>
            )}
          </div>

          {/* Available Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-emerald-700">
                Start Time
              </label>
              <select
                name="avaliable_time[0]"
                value={formData.avaliable_time?.[0] || ""}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    avaliable_time: [
                      e.target.value,
                      p.avaliable_time?.[1] || "",
                    ],
                  }))
                }
                className={`w-full mt-1 p-2 border rounded-lg ${
                  errors.avaliable_time ? "border-red-500" : ""
                }`}
              >
                <option value="">Select</option>
                {hours.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-700">
                End Time
              </label>
              <select
                name="avaliable_time[1]"
                value={formData.avaliable_time?.[1] || ""}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    avaliable_time: [
                      p.avaliable_time?.[0] || "",
                      e.target.value,
                    ],
                  }))
                }
                className={`w-full mt-1 p-2 border rounded-lg ${
                  errors.avaliable_time ? "border-red-500" : ""
                }`}
              >
                <option value="">Select</option>
                {hours.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {errors.avaliable_time && (
            <p className="text-red-500 text-sm mt-1">{errors.avaliable_time}</p>
          )}

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
