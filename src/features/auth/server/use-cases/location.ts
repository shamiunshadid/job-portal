import { headers } from "next/headers";

const IP_HEADER_PRIORITY = [
  "cf-connecting-ip",   // Cloudflare proxy
  "x-client-ip",        // Common proxy header
  "x-forwarded-for",    // Most common - contains original IP
  "x-real-ip",          // Another common header
  "x-cluster-client-ip", // Load balancers
  "forwarded-for",      // Standard HTTP Forwarded header
  "forwarded",          // Standard HTTP Forwarded header
];

export async function getIpAdress() {
  const headerList = await headers();
  
  for (const header of IP_HEADER_PRIORITY) {
    const value = headerList.get(header);
    
    if (typeof value === "string") {
      const ip = value.split(",")[0].trim();
      if (ip) return ip;
    }
  }

  return "0.0.0.0";
}
