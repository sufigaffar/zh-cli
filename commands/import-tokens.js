import Conf from 'conf';
import {readFileSync} from "fs";
import fetch from 'node-fetch';
import {uploadToS3} from "../utils/upload-to-s3.js";
import {getWebUrl} from "../utils/url.js";
import prompt from 'prompt-sync';

const config = new Conf({projectName: 'zh-cli'});

async function importTokens(setId, filePath) {
  const authToken = config.get('token');

  // First lets make a request to generate the upload request
  const uploadRequestResponse = await fetch(`https://${getWebUrl()}/api/token_management/upload`, {
    method: 'post',
    body: JSON.stringify({
      file_type: 'application/json',
      token_set_id: setId
    }),
    headers: {
      Authorization: `Token token="${authToken}"`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
  const parsedUploadRequestResponse = await uploadRequestResponse.json();
  const uploadRequest = parsedUploadRequestResponse.upload_request;
  // Then we make a request to S3 to upload
  const file = readFileSync(filePath, 'utf8');

  const { fileKey, s3Response } = await uploadToS3(
    uploadRequest.key,
    uploadRequest,
    file
  );

  if (!s3Response.ok) {
    console.log('Failed uploading file to S3. Please try again.');
  }

  const params = new URLSearchParams({
    s3_file: fileKey.split('/').slice(-1)[0],
  });

  const uploadFileResponse = await fetch(`https://${getWebUrl()}/api/token_management/preview?${params}`, {
    method: 'get',
    headers: {
      Authorization: `Token token="${authToken}"`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  const parsedUploadFileResponse = await uploadFileResponse.json();
  const json = parsedUploadFileResponse.json;

  console.log('Tokens to be imported:');
  console.log(json);

  const shouldProceed = prompt()('Do you wish to proceed? (Y/n)');

  if (shouldProceed === 'n') {
    return;
  }

  const importTokensResponse = await fetch(`https://${getWebUrl()}/api/token_management/import`, {
    method: 'post',
    body: JSON.stringify({
      s3_file: fileKey.split('/').slice(-1)[0],
      token_set_id: setId
    }),
    headers: {
      Authorization: `Token token="${authToken}"`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  try {
    if (importTokensResponse.ok) {
      console.log(`Tokens succesfully imported! View at https://${getWebUrl()}/tokens/${setId}`);
    } else {
      console.log('Tokens failed to import. Please try again.');
    }
  } catch (e) {
    console.log('Tokens failed to import. Please try again.');
  }
}

export default importTokens;
