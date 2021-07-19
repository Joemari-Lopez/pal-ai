import axios from "axios"

export default axios.create({
    baseURL:"https://pal-ai-api.herokuapp.com",
    headers: { "Content-Type": "multipart/form-data" },
})