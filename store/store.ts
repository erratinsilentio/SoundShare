import { atom } from "nanostores";

type ScreenMode = boolean;
export const $darkMode = atom<ScreenMode>(true);
