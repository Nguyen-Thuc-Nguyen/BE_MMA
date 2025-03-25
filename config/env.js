import dotenv from "dotenv"
const loadEnv = () => {
    const result = dotenv.config();
    if (result.error) {
        throw result.error;
    }
    console.log('Environment variables loaded');
};

export default loadEnv
