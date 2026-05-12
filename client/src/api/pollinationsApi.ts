import axios, { AxiosInstance } from "axios"

const pollinationsBaseUrl = "https://gen.pollinations.ai"

const instance: AxiosInstance = axios.create({
    baseURL: pollinationsBaseUrl,
    headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer sk_iouhdbEfya0Z9R4Ixh9Ixa3SMeoVKIiM"
    },
})

export default instance