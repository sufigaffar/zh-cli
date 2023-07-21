import Conf from 'conf';
import fetch from 'node-fetch';
import {getUserInfo} from "../api/user.js";
import {getWebUrl} from "../utils/url.js";

const config = new Conf({projectName: 'zh-cli'});

async function create(name) {
  const authToken = config.get('token');
  const user = await getUserInfo()

  const response = await fetch(`https://${getWebUrl()}/api/token_management/token_set`, {
    method: 'post',
    body: JSON.stringify({
      name: name,
      team_id: user.team_id
    }),
    headers: {
      Authorization: `Token token="${authToken}"`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  try {
    const jsonResponse = await response.json();
    console.log(`Token set ${name} successfully created! ID: ${jsonResponse.id}`);
  } catch (e) {
    console.log('Failed to create token set. Please try again.')
  }
}

export default create;
