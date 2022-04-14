const axios = require("axios")

const url = "http://api.quotable.io/random"

module.exports = getData=()=>{
    return axios
            .get(url)
            .then(res=> res.data.content.split(" "))
}