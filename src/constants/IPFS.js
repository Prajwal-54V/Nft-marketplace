import { Buffer } from "buffer";
import { create as ipfsHttpClient } from "ipfs-http-client";
const projectId = "2N9f5AoKdaMwTOFrSPrrpS7TRxb";
const projectSecret = "949476f7567516616a806fd4d06c2a88";
export const subdomain = "realestateproject.infura-ipfs.io";
// Pay attentnion at the space between Basic and the $ in the next line
// encrypt the authorization
const authorization = `Basic ${Buffer.from(
  `${projectId}:${projectSecret}`
).toString("base64")}`;

export const client = ipfsHttpClient({
  host: "infura-ipfs.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: authorization,
  },
});
