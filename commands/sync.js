import Conf from 'conf';
import fetch from 'node-fetch';
import {getInfo} from "../utils/token-set.js";
import {getWebUrl} from "../utils/url.js";

const config = new Conf({projectName: 'zh-cli'});

async function sync(setId) {
  const authToken = config.get('token');

  const tokenSetInfo = await getInfo(setId);
  const integrationId = 60; // Get integration ID properly from the user

  console.log(`Syncing token set ${tokenSetInfo.name}...`);

  const response = await fetch(`https://${getWebUrl()}/api/token_management/import`, {
    method: 'post',
    body: JSON.stringify({
      integration_id: integrationId,
      token_set_id: setId,
      repo_id: tokenSetInfo.repo_id,
      repo_path: tokenSetInfo.path,
    }),
    headers: {
      Authorization: `Token token="${authToken}"`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  console.log(`Token set ${tokenSetInfo.name} successfully synced!`);
}

export default sync;
