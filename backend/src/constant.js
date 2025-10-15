// import jwt from "jsonwebtoken";

// const generateAccessToken = async (email,id) => {
//   return jwt.sign(
//     {
//       id: id,
//       email: email,
//     },
//     process.env.ACCESS_TOKEN_SECRECT,
//     { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
//   );
// };

// const generateRefreshToken = async (id) => {
//   return jwt.sign(
//     {
//       id: id,
//     },
//     process.env.REFRESH_TOKEN_SECRECT,
//     { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
//   );
// };

// // export const ORIGIN="http://localhost:3000"
// export { generateAccessToken, generateRefreshToken };

