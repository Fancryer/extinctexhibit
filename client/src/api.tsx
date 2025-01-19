import axios,{AxiosResponse} from "axios";

export default axios.create({baseURL:'http://localhost:6060/api/'});
export const extractData=<T,>(r:AxiosResponse<T,any>)=>r.data;