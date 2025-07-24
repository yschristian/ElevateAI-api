import jwt from "jsonwebtoken";
import { config } from "../config/config";

const jwtHelper = {
    sign: (payload: any) => jwt.sign(payload, config.key.secret, { expiresIn: '24h' }),
    verify: (payload: any) => jwt.verify(payload, config.key.secret)
};

export default jwtHelper;

