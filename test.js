const axios = require("axios");

(async () => {
    console.log((await axios.get("http://localhost:9000/")).data);
    try {
        const x = await axios.post("http://localhost:9000/api/auth/login", 
            { username: "Bob Brown", password: "b0bSecure" },
            { withCredentials: true }
        )
        console.log(x.data);
        
    } catch (error) {
        console.error(error);
        console.log(error.message);
    }
})()