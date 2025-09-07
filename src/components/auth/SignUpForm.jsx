export default function SignUpForm({ register, errors, watch }) {
  const password = watch("password");

  const inputClass =
    "border border-neutral-300 bg-neutral-100/30 p-2 rounded text-neutral-700 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400";

  return (
    <>
      <input {...register("name", { required: "Name is required" })} placeholder="Name" className={inputClass} />
      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

      <input {...register("surName", { required: "Surname is required" })} placeholder="Surname" className={inputClass} />
      {errors.surName && <p className="text-red-500 text-sm">{errors.surName.message}</p>}

      <input
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Invalid email address",
          },
        })}
        type="email"
        placeholder="Email"
        className={inputClass}
      />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

      <input
        {...register("password", {
          required: "Password is required",
          minLength: { value: 8, message: "Min length is 8" },
        })}
        type="password"
        placeholder="Password"
        className={inputClass}
      />
      {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

      <input
        {...register("confirmPassword", {
          required: "Confirm your password",
          validate: (value) => value === password || "Passwords do not match",
        })}
        type="password"
        placeholder="Confirm Password"
        className={inputClass}
      />
      {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}

      <input
        {...register("birthDate", { required: "Birth date is required" })}
        type="date"
        className={inputClass}
      />
      {errors.birthDate && <p className="text-red-500 text-sm">{errors.birthDate.message}</p>}

      <div className="flex flex-col space-y-2">
        <label className="font-medium text-neutral-700">Select Role</label>
        <label className="inline-flex items-center space-x-2">
          <input {...register("role", { required: "Role is required" })} type="radio" value="renter" />
          <span className="text-neutral-700">Renter</span>
        </label>
        <label className="inline-flex items-center space-x-2">
          <input {...register("role", { required: "Role is required" })} type="radio" value="mate" />
          <span className="text-neutral-700">Mate</span>
        </label>
        {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
      </div>
    </>
  );
}
