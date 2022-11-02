export const themeColors = {
  orange: "#FFA566",
  oxfordBlue: "#0E1428",
  richBlack: "#011627",
  jet: "#302B27",
};

const baseUrl = process.env.BACKEND_URL;

export const apiRoutes = {
  auth: `${baseUrl}/auth`,
  content: `${baseUrl}/content`,
  progress: `${baseUrl}/auth`,
};
