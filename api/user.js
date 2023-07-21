import fetch from "node-fetch";
import {getWebUrl} from "../utils/url.js";

import Conf from 'conf';
const config = new Conf({projectName: 'zh-cli'});

export async function getUserInfo() {
  const authToken = config.get('token');

  const response = await fetch(`https://${getWebUrl()}/api/current_user`, {
    method: 'get',
    headers: {Authorization: `Token token="${authToken}"`}
  });

  return await response.json();
}
