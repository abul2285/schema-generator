export const Modal = ({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) => {
  if (!open) return null;
  return (
    <>
      <div className="fixed top-0 left-0 z-10 grid h-full w-full place-items-center bg-[rgba(0,0,0,0.5)]">
        <dialog
          open={open}
          className="rounded-lg border border-black bg-white p-5 shadow-lg"
        >
          {children}
        </dialog>
      </div>
    </>
  );
};
