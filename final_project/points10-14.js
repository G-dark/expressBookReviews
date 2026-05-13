const axios = require("axios")

const urlBase = "http://localhost:5000"

const getAllBooks = await axios.get(baseUrl) // 1
const getAllBooks = await axios.get(urlBased + "/isbn/9780802144478");// 2
const getAllBooks = await axios.get(baseUrl + "/author/Dante Alighieri") //3
const getAllBooks = await axios.get(baseUrl + "/title/Fairy%20tales")//4
