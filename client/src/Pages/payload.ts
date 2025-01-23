import Cookies              from "js-cookie";
import {RequestWithPayload} from "../types";

export function makePayload<T>(t:T):RequestWithPayload<T>
{
	return {
		accessToken:Cookies.get('accessToken')||'',
		payload:    t
	};
}