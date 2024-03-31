import axios from 'axios'

axios.defaults.baseURL =
    // if NODE_ENV is not equal to 'production', then use localhost port 5000, otherwise use current address ('/')
    process.env.NODE_ENV !== 'production' ? 'http://localhost:5000' : '/';