import { MantineThemeOverride } from "@mantine/core";
import { themeColors } from "./constants";

export const testTheme: MantineThemeOverride = {
  colorScheme: "dark",
};

export const otherTheme: MantineThemeOverride = {
  colorScheme: "light",
  primaryColor: themeColors.jet,
};
