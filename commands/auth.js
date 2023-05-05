import Conf from 'conf';

const config = new Conf({projectName: 'zh-cli'});

function auth(token) {
  config.set('token', token)
}

export default auth;
