import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes } from "date-fns";
import { useEffect, useState } from "react";
import api from "../../api/apiClient";

export default function RentingForm({
  register,
  Controller,
  control,
  setValue,
  watch,
  formState,
  mateData,
}) {
  const startTime = watch("startTime");
  const [unavailableSlots, setUnavailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);

  useEffect(() => {
    if (!startTime) return;
    const dateStr = startTime.toLocaleDateString("en-CA");

    const fetchUnavailable = async () => {
      setLoadingSlots(true);
      try {
        // console.log("start")
        console.log(dateStr);
        const res = await api.get(
          `/api/booking/unavaliable?mateId=${mateData.id}&date=${dateStr}`
        );
        setUnavailableSlots(
          res.data.map((b) => ({
            start: new Date(b.start),
            end: new Date(b.end),
          }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSlots(false);
        // console.log("Done")
      }
    };

    fetchUnavailable();
  }, [startTime, mateData.id]);

  useEffect(() => {
    console.log("unavailableSlots updated:", unavailableSlots);
  }, [unavailableSlots]);

  useEffect(() => {
    setValue("endTime", null);
  }, [startTime, setValue]);

  useEffect(() => {
    console.log(`first call:${startTime}`);
    if (!startTime || loadingSlots) return;
    const [availStartStr] = mateData.avaliable_time;
    const availStartHour = +availStartStr.split(":")[0];
    const tempDate = new Date(startTime);

    // console.log(tempDate);
    // console.log(availStartHour)
    if (
      tempDate.getHours() === 0 &&
      tempDate.getMinutes() === 0 &&
      String(availStartHour) !== "0"
    ) {
      tempDate.setHours(availStartHour, 0);
      // const result = setReal_avaliableStartTime(tempDate);
      // console.log(`result: ${result}`)
      setValue("startTime", tempDate);
      // console.log(`startTime: ${startTime}`);
    }
  }, [startTime, setValue, mateData.avaliable_time, loadingSlots]);

  const filterDate = (date) => {
    const day = date.getDay();
    switch (mateData.avaliable_date) {
      case "weekdays":
        return day >= 1 && day <= 5;
      case "weekends":
        return day === 0 || day === 6;
      case "all":
      default:
        return true;
    }
  };

  const filterStartTime = (time) => {
    if (loadingSlots) {
      return false;
    }
    const now = new Date();
    if (time <= now) {
      return false;
    }
    if (!mateData.avaliable_time || mateData.avaliable_time.length !== 2)
      return true;

    // console.log(time);

    const [startStr, endStr] = mateData.avaliable_time;
    const startHour = +startStr.split(":")[0];
    const endHour = +endStr.split(":")[0];

    const hour = time.getHours();
    const minute = time.getMinutes();

    // จำกัด startTime ไม่ให้สูงสุดเกิน endHour - 1
    if (minute !== 0 || hour < startHour || hour > endHour - 1) return false;

    // เช็คกับ unavailableSlots
    const conflict = unavailableSlots.some(
      (slot) => time >= slot.start && time < slot.end
    );

    return !conflict;
  };

  // const setReal_avaliableStartTime = (date) => {
  //   if (loadingSlots) return null;

  //   const [startStr, endStr] = mateData.avaliable_time;
  //   const startHour = +startStr.split(":")[0];
  //   const endHour = +endStr.split(":")[0];

  //   for (let i = startHour; i < endHour; i++) {
  //     const time = new Date(date);
  //     time.setHours(i, 0, 0, 0);
  //     console.log(time)
  //     const result = filterStartTime(time);
  //     if (result) {
  //       return time;
  //     }
  //   }
  //   return null;
  // };

  const filterEndTime = (time) => {
    if (!startTime) return false;
    const now = new Date();
    if (time <= now) {
      return false;
    }

    const startDate = new Date(startTime);
    const [availStartStr, availEndStr] = mateData.avaliable_time;
    const availEndHour = +availEndStr.split(":")[0];

    const hour = time.getHours();
    const minute = time.getMinutes();

    // ต้องเป็นชั่วโมงเต็ม, >= startHour+1, <= availEndHour
    if (minute !== 0 || hour < startDate.getHours() + 1 || hour > availEndHour)
      return false;

    // ตรวจสอบกับ unavailableSlots
    const conflict = unavailableSlots.some(
      (slot) => time > slot.start && time <= slot.end
    );

    return !conflict;
  };

  const inputClasses =
    "w-full border border-blue-200 rounded-lg p-2 h-10 sm:h-12 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500";

  return (
    <div className="mt-6 w-full max-w-3xl mx-auto px-2 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:space-x-4 gap-4">
        {/* Start Time */}
        <Controller
          control={control}
          name="startTime"
          rules={{ required: "Start time is required" }}
          render={({ field }) => (
            <div className="flex-1 flex flex-col">
              <label className="mb-1 font-medium text-blue-700">
                Start Time:
              </label>
              <DatePicker
                placeholderText="Select start date and time"
                selected={startTime}
                onChange={(date) => {
                  if (!date) return;

                  const temp = new Date(date);

                  // ถ้า user เลือกเฉพาะวัน ให้เซ็ต default เวลา
                  // if (temp.getHours() === 0 && temp.getMinutes() === 0) {
                  //   const result = setReal_avaliableStartTime(temp);
                  //   console.log(`result: ${result}`);
                  //   console.log(`temp:${temp}`);
                  // }

                  field.onChange(temp);
                }}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={60}
                dateFormat="MMMM d, yyyy h:mm aa"
                filterDate={filterDate}
                filterTime={(time) => !!startTime && filterStartTime(time)}
                minDate={new Date()}
                className={inputClasses}
                shouldCloseOnSelect={false}
              />

              {formState.errors.startTime && (
                <p className="text-red-500 text-sm mt-1">
                  {formState.errors.startTime.message}
                </p>
              )}
            </div>
          )}
        />

        {/* End Time */}
        <Controller
          control={control}
          name="endTime"
          rules={{ required: "End time is required" }}
          render={({ field }) => {
            if (!startTime) {
              return (
                <div className="flex-1 flex flex-col opacity-50">
                  <label className="mb-1 font-medium text-blue-700">
                    End Time:
                  </label>
                  <input
                    placeholder="Select start time first"
                    disabled
                    className={inputClasses + " cursor-not-allowed"}
                  />
                </div>
              );
            }

            // เอาวันจาก startTime
            const startDate = new Date(startTime);
            const [availStartStr, availEndStr] = mateData.avaliable_time;
            const availStartHour = +availStartStr.split(":")[0];
            const availEndHour = +availEndStr.split(":")[0];

            // ถ้า startTime ไม่มีเวลา ให้ default startHour
            if (startDate.getHours() === 0 && startDate.getMinutes() === 0) {
              startDate.setHours(availStartHour, 0);
            }

            // สร้าง default endTime เป็น startTime + 1 ชั่วโมง
            let endDate;
            if (field.value) {
              endDate = new Date(field.value);
            } else {
              const defaultEndHour = Math.min(
                startDate.getHours() + 1,
                availEndHour
              );
              endDate = new Date(startDate);
              endDate.setHours(defaultEndHour, 0, 0, 0);
            }
            endDate.setDate(startDate.getDate());
            endDate.setMonth(startDate.getMonth());
            endDate.setFullYear(startDate.getFullYear());

            // min/max end time
            const startHourSelected = startDate.getHours();
            const minEndHour =
              startHourSelected + 1 <= availEndHour
                ? startHourSelected + 1
                : availEndHour;
            const maxEndHour = availEndHour;

            return (
              <div className="flex-1 flex flex-col">
                <label className="mb-1 font-medium text-blue-700">
                  End Time:
                </label>
                <DatePicker
                  placeholderText="Select end time"
                  selected={endDate}
                  onChange={(val) => {
                    const d = new Date(val);
                    d.setDate(startDate.getDate());
                    d.setMonth(startDate.getMonth());
                    d.setFullYear(startDate.getFullYear());
                    field.onChange(d);
                  }}
                  showTimeSelect
                  showTimeSelectOnly
                  timeFormat="HH:mm"
                  dateFormat="h:mm aa"
                  timeIntervals={60}
                  minTime={setHours(
                    setMinutes(startDate, 0),
                    startDate.getHours() + 1
                  )}
                  maxTime={setHours(setMinutes(startDate, 0), availEndHour)}
                  filterTime={filterEndTime}
                  className={inputClasses}
                />
                {formState.errors.endTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {formState.errors.endTime.message}
                  </p>
                )}
              </div>
            );
          }}
        />
      </div>

      {/* Place / Purpose */}
      <div className="flex flex-col sm:flex-row sm:space-x-4 gap-4 mt-6">
        {/* Place */}
        <div className="flex-1 flex flex-col">
          <input
            {...register("place", {
              required: "Place is required",
              maxLength: {
                value: 25,
                message: "Place must be at most 25 characters",
              },
            })}
            placeholder="Place"
            maxLength={25} 
            className={inputClasses}
          />
          {formState.errors.place && (
            <p className="text-red-500 text-sm mt-1">
              {formState.errors.place.message}
            </p>
          )}
        </div>

        {/* Purpose */}
        <div className="flex-1 flex flex-col">
          <input
            {...register("purpose", {
              required: "Purpose is required",
              maxLength: {
                value: 25,
                message: "Purpose must be at most 25 characters",
              },
            })}
            placeholder="Purpose"
            maxLength={25} 
            className={inputClasses}
          />
          {formState.errors.purpose && (
            <p className="text-red-500 text-sm mt-1">
              {formState.errors.purpose.message}
            </p>
          )}
        </div>
      </div>

      {/* Others */}
      <div className="flex flex-col mt-6">
        <input
          {...register("others", {
            maxLength: {
              value: 30,
              message: "Others must be at most 30 characters",
            },
          })}
          placeholder="Others"
          maxLength={30}
          className={inputClasses}
        />
        {formState.errors.others && (
          <p className="text-red-500 text-sm mt-1">
            {formState.errors.others.message}
          </p>
        )}
      </div>
    </div>
  );
}
