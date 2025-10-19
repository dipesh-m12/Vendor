// store/regTypeStore.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useRegTypeStore = create(
  persist(
    (set) => ({
      regType: "owner", // Default registration type: "owner" or "helper"
      setRegType: (type) => set({ regType: type }),
      resetRegType: () => set({ regType: "owner" }),
    }),
    {
      name: "reg-type-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useRegTypeStore;
