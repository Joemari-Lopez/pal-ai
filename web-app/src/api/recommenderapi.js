import axios from "axios"

export default axios.create({
    baseURL:"https://pal-ai.herokuapp.com",
    headers: { "Content-Type": "multipart/form-data" },
})