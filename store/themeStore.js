// store/themeStore.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useThemeStore = create(
  persist(
    (set) => ({
      isDark: false,
      language: "English", // Default language
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useThemeStore;
