import { useState, useEffect, useRef } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import api from "../../api/apiClient";
import { createPortal } from "react-dom";

export default function SearchOverlay() {
  const [search, setSearch] = useState("");
  const [interestInput, setInterestInput] = useState(""); // input ของ renter
  const [selectedInterests, setSelectedInterests] = useState([]); // selected multi
  const [avaliableDate, setAvaliableDate] = useState(""); // "" = not selected
  const [minRate, setMinRate] = useState(null); // filter ขั้นต่ำ review_rate
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [open, setOpen] = useState(false);
  const pageSize = 5;

  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  const defaultInterests = ["game", "drinks", "gym", "coding"];

  // โหลด mates
  useEffect(() => {
    async function fetchMates() {
      try {
        const res = await api.get("/search/mates", {
          params: {
            search,
            interest:
              selectedInterests.length > 0
                ? selectedInterests.join(",")
                : undefined,
            avaliable_date: avaliableDate || undefined,
            minRate: minRate != null ? minRate : undefined,
            page,
            pageSize,
          },
        });
        setData(res.data.data);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error(err);
      }
    }
    if (open) fetchMates();
  }, [search, selectedInterests, avaliableDate, minRate, page, open]);

  // close overlay click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // เพิ่ม/จัดการ interest จาก input
  const addCustomInterests = () => {
    if (!interestInput.trim()) return;
    const newItems = interestInput
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i && !selectedInterests.includes(i));
    setSelectedInterests([...selectedInterests, ...newItems]);
    setInterestInput("");
    setPage(1);
  };

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
    setPage(1);
  };

  // ✨ สร้าง overlay ด้วย Portal
  const overlay = open ? (
    <div
      ref={wrapperRef}
      className="fixed top-[60px] left-1/2 -translate-x-1/2 
                 w-full sm:max-w-xl bg-white border border-blue-200 
                 shadow-xl rounded-2xl z-[9999] overflow-y-auto max-h-[70vh] p-4 text-neutral-800"
    >
      {/* Filter Section */}
      <div className="mb-4 flex flex-col gap-4">
        {/* Interest Multi-select */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Interests
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {defaultInterests.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleInterest(i)}
                className={`px-3 py-1 rounded-full border text-sm transition-all ${
                  selectedInterests.includes(i)
                    ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                    : "bg-white text-gray-700 border-blue-300 hover:bg-blue-50"
                }`}
              >
                {i}
              </button>
            ))}
            {selectedInterests
              .filter((i) => !defaultInterests.includes(i))
              .map((i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1"
                >
                  {i}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedInterests((prev) =>
                        prev.filter((x) => x !== i)
                      )
                    }
                    className="text-blue-500 font-bold hover:text-blue-700"
                  >
                    ×
                  </button>
                </span>
              ))}
          </div>
          <input
            type="text"
            placeholder="พิมพ์เพิ่มแล้วกด Enter หรือ ,"
            value={interestInput}
            onChange={(e) => setInterestInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addCustomInterests();
              }
            }}
            className="w-full border border-blue-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          />
        </div>

        {/* Available Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Available Date
          </label>
          <select
            value={avaliableDate}
            onChange={(e) => {
              setAvaliableDate(e.target.value);
              setPage(1);
            }}
            className="w-full border border-blue-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          >
            <option value="">-- Select Available Date --</option>
            <option value="weekdays">Weekdays</option>
            <option value="weekends">Weekends</option>
            <option value="all">All Days</option>
          </select>
        </div>

        {/* Review Rate */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Minimum Review Rate
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-yellow-50 rounded-lg p-1 px-2">
              {/* 0 ดาว */}
              <span
                className={`cursor-pointer text-yellow-500 text-lg font-bold transition-all ${
                  minRate === 0
                    ? "bg-yellow-300 rounded px-1"
                    : "opacity-40 hover:opacity-80"
                }`}
                onClick={() => {
                  setMinRate(0);
                  setPage(1);
                }}
              >
                ☆
              </span>
              <span className="text-gray-400 select-none">|</span>

              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={`cursor-pointer text-yellow-500 text-lg font-bold transition-all ${
                    i <= (minRate ?? 0)
                      ? "bg-yellow-300 rounded px-1"
                      : "opacity-40 hover:opacity-80"
                  }`}
                  onClick={() => {
                    setMinRate(i);
                    setPage(1);
                  }}
                >
                  ★
                </span>
              ))}
            </div>

            <button
              onClick={() => setMinRate(null)}
              className="ml-2 px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-lg hover:bg-blue-100 transition"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <ul className="divide-y divide-blue-100 text-sm sm:text-base">
        {data.map((item) => (
          <li
            key={item.id}
            onClick={() => navigate(`/renter/mate-profile?mateId=${item.id}`)}
            className="py-2 px-2 sm:px-3 rounded-lg hover:bg-blue-50 
                       flex justify-between items-center transition cursor-pointer flex-wrap"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img
                src={item.pic.secure_url}
                alt=""
                className="w-10 h-10 rounded-full object-cover border border-blue-200 shadow-sm flex-shrink-0"
              />
              <span className="font-medium text-gray-700 truncate">
                {item.name} {item.surName}
              </span>
            </div>
            <div className="flex gap-2 items-center flex-shrink-0 mt-1 sm:mt-0">
              <span className="text-xs sm:text-sm text-blue-500 bg-blue-50 px-2 py-1 rounded-md">
                {item.city}
              </span>
              {item.review_rate != null && (
                <span className="text-xs sm:text-sm text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md">
                  ⭐ {item.review_rate}
                </span>
              )}
            </div>
          </li>
        ))}
        {data.length === 0 && (
          <li className="py-6 text-center text-blue-400 font-medium">
            ไม่พบข้อมูล
          </li>
        )}
      </ul>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6 text-sm sm:text-base flex-wrap">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 rounded-lg bg-blue-100 text-blue-600 disabled:opacity-40 hover:bg-blue-200 transition"
          >
            Prev
          </button>
          <span className="text-blue-600 font-medium">
            {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 rounded-lg bg-blue-100 text-blue-600 disabled:opacity-40 hover:bg-blue-200 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  ) : null;

  return (
    <div className="relative w-full max-w-full sm:max-w-xl mx-auto px-2 sm:px-4">
      {/* Search Bar */}
      <div
        className="flex items-center w-full bg-blue-50/60 px-3 sm:px-4 py-2 sm:py-3 rounded-full
                  ring-1 ring-blue-300 hover:ring-2 hover:ring-blue-400
                  focus-within:ring-2 focus-within:ring-blue-500
                  transition-all hover:scale-110 focus-within:scale-110 shadow-sm"
      >
        <input
          type="text"
          placeholder="Search by name, surname, or city..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
            setOpen(e.target.value.trim() !== "");
          }}
          className="flex-1 min-w-0 bg-transparent outline-none text-neutral-700 
                 placeholder:text-blue-300 text-sm sm:text-base pointer-events-auto"
        />
        <IoSearchOutline className="ml-2 text-lg text-blue-500 flex-shrink-0" />
      </div>

      {/* Overlay */}

      {/* render overlay ด้วย Portal */}
      {typeof document !== "undefined" ? createPortal(overlay, document.body) : null}
    </div>
  );
}
