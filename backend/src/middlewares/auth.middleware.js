import { getAuth } from "@clerk/express";

// export const protectRoute = (req, res, next) => {
// if (!req.auth().isAuthenticated) {
//   console.log("Incoming auth header:", req.headers.authorization);

//   return res
//     .status(401)
//     .json({ message: "Unauthorized - you must be logged in" });
// }

//   try {
//     const { userId } = getAuth(req);
//     if (!userId) {
//       console.log(
//         "❌ No Clerk userId found. Incoming header:",
//         req.headers.authorization
//       );
//       return res
//         .status(401)
//         .json({ message: "Unauthorized - you must be logged in" });
//     }
//     req.userId = userId; // ✅ attach to request
//     next();
//   } catch (err) {
//     console.error("Auth middleware error:", err);
//     return res.status(401).json({ message: "Unauthorized - invalid token" });
//   }
// };

export const protectRoute = async (req, res, next) => {
  try {
    const { userId } = await getAuth(req);
    if (!userId) {
      console.log(
        "❌ No Clerk userId found. Incoming header:",
        req.headers.authorization
      );
      return res
        .status(401)
        .json({ message: "Unauthorized - you must be logged in" });
    }
    req.userId = userId;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "Unauthorized - invalid token" });
  }
};
