import bcryptjs from "bcryptjs";

export const comparePassword = async (pass: string, passHash: string) => {
    try {
        return await bcryptjs.compare(pass, passHash);
    } catch (error) {
        console.log(error);
    }
};

export const hashPassword = async (password: string) => {
    try {
        const hash = await bcryptjs.hash(password, 10);
        return hash;
    } catch (error) {
        console.log(error);
    }
};