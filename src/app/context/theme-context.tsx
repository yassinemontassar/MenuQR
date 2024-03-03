"use client";
import { createContext, useContext, useState } from "react";

type ThemeContextPorivderProps = {
  children: React.ReactNode;
};
type ThemeContext = {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  restaurantName: string;
  setRestaurantName: React.Dispatch<React.SetStateAction<string>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
};

export const ThemeContext = createContext<ThemeContext | null>(null);

export default function ThemeContextPorivder({
  children,
}: ThemeContextPorivderProps) {
  const [theme, setTheme] = useState("light");
  const [restaurantName, setRestaurantName] = useState("name");
  const [title, setTitle] = useState("");
  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        restaurantName,
        setRestaurantName,
        title,
        setTitle,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContetx must be used");
  }
  return context;
}
