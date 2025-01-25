import challenge from "./challenge";
import qr from "./qr";
import stage from "./stage";

export { stage, qr, challenge };

const services = { stage, qr, challenge } as const;

export default services;
