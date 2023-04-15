export const FullPageLoading = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <div className="flex h-64 w-64 items-center justify-center rounded-lg shadow-lg">
        <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-solid border-blue-500"></div>
      </div>
    </div>
  );
};
