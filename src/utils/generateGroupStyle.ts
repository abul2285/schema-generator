export const generateGroupStyle = (address: string) => {
  return (
    {
      3: "ml-8",
      5: "ml-12",
      7: "ml-16",
    }[address.length] || "ml-0"
  );
};
