// TODO SELISE MEDIA BLOCK: Replace with real upload API

export const storageService = {
  uploadImage: async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };
      reader.readAsDataURL(file);
    });
  },
  deleteImage: async (url: string): Promise<void> => {
    return new Promise((resolve) => {
       // Mock delete
       resolve();
    });
  }
};
