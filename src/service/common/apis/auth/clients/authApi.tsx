import axios from "axios";
import BASE_URL from "../../Api";



export default axios.create({
  baseURL: `${BASE_URL}/auth`,
});




