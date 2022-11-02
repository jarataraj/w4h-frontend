import axios from "axios";
const baseUrl = "/api/forecast";

const get = async (lat, lon) => {
    const res = await axios.get(`${baseUrl}/${lat}-${lon}`);
    return res.data;
};

export default { get };
