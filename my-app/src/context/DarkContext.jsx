import { createContext, useContext } from "react";

export const DarkContext = createContext(false);

export const useDark = () => useContext(DarkContext);
