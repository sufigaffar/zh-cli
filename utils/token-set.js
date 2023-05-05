import fetch from "node-fetch";
import {getWebUrl} from "./url.js";

import Conf from 'conf';
const config = new Conf({projectName: 'zh-cli'});

export async function getInfo(setId) {
  const authToken = config.get('token');

  const response = await fetch(`https://${getWebUrl()}/api/token_management/token_set?id=${setId}`, {
    method: 'get',
    headers: {Authorization: `Token token="${authToken}"`}
  });

  return await response.json();
}
