// store/themeStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
