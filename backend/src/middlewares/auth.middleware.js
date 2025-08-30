import { requireAuth } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
  // if (!req.auth().isAuthenticated) {
  //   console.log("Incoming auth header:", req.headers.authorization);

  //   return res
  //     .status(401)
  //     .json({ message: "Unauthorized - you must be logged in" });
  // }

  requireAuth()(req, res, (err) => {
    if (err) {
      console.log("Auth error:", err);
      return res
        .status(401)
        .json({ message: "Unauthorized - you must be logged in" });
    }

    next();
  });
};
