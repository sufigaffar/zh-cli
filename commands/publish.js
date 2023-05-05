import Conf from 'conf';
import fetch from 'node-fetch';
import {getInfo} from "../utils/token-set.js";
import {getWebUrl} from "../utils/url.js";

const config = new Conf({projectName: 'zh-cli'});

async function publish(setId) {
  const authToken = config.get('token');

  const tokenSetInfo = await getInfo(setId);

  console.log(`Publishing token set ${tokenSetInfo.name}...`);

  const response = await fetch(`https://${getWebUrl()}/api/token_management/token_set/publish?id=${setId}`, {
    method: 'post',
    headers: {Authorization: `Token token="${authToken}"`}
  })

  console.log(`Token set ${tokenSetInfo.name} successfully published!`);
}

export default publish;
