// Helper function to convert file to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      resolve(base64.split(",")[1]); // Remove the data: prefix
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export default fileToBase64;
