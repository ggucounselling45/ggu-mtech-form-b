import crypto from "crypto";

const generateInvitationCode = () => {
    return crypto
        .randomBytes(4)
        .toString("hex")
        .toUpperCase();
};

export default generateInvitationCode;