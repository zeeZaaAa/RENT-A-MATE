export default function PopUpSendEmail({backMsg, email}) {
  return (
    <>
      <div
        className="flex fixed inset-0 items-center justify-center backdrop-blur-[1px] z-50 font-quicksand "
      >
        <div className="text-neutral-900 dark:text-neutral-200 bg-neutral-200 hover:bg-neutral-100 rounded-lg shadow-lg w-120 h-70 p-6 text-center border border-neutral-400/30 space-y-8 hover:border-neutral-600/30 dark:bg-neutral-800 hover:dark:bg-neutral-900">
          <p>{backMsg}</p>
          <p>
            A verify email is being sent to {email}.
          </p>
          <p>
            *If you don't see it in your inbox, please check your junk/spam folder.
          </p>
          <button onClick={() => (window.location.href = "/")}>Continue</button>
        </div>
      </div>
    </>
  );
}
