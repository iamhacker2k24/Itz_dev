import express from "express"
import cors from "cors"
import { chat } from "./ai.js"
const app = express()
app.use(cors())
app.use(express.json())

app.get("/api/health", (req, res) => {
    try {
        res.status(200).json({
            sucess: true,
            msg: "server started "
        })

    } catch (error) {
        res.status(200).json({
            sucess: true,
            msg: error.message
        })
    }

})


app.post("/api/ai/chat", async (req, res) => {
    try {

        const { ques } = req.body;
        console.log(ques);
        const response = await chat(ques);
        // console.log(response)
        res.status(200).json({
            success: true,
            msg: response
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: "api error from api in backend api " + error.message,
        })
    }
})

app.listen(3000, () => {
    console.log("server sttarted")
})