export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/properties/add", "/profiles", "/properties/saved", "/messages"],
};
