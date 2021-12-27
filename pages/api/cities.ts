import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { readFileSync } from "fs";

const allowedCities = [
  "Barisal",
  "Chittagong",
  "Dhaka",
  "Khulna",
  "Rajshahi",
  "Rangpur",
  "Sylhet",
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = readFileSync(path.resolve("./public", "cities.json"), "utf-8");
  const cities = JSON.parse(data).cities;

  if (!req.query.city) {
    return res.status(400).json({
      message: "city is required",
    });
  }

  if (!allowedCities.includes(req.query.city as string)) {
    return res.status(400).json({
      message:
        "city is not allowed. Allowed cities are: " +
        allowedCities.map((city) => `"${city}"`).join(", "),
    });
  }

  const city = req.query.city as string;

  res.status(200).json({ ...cities[city] });
}
