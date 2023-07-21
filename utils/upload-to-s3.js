import fetch from 'node-fetch';
import {FormData} from "node-fetch";

/**
 * Lifted from S3UploadService in rails app
 */
export function uploadToS3(fileKey, uploadRequest, binaryData) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    Object.keys(uploadRequest).forEach((key) => {
      if (key === 'url') {
        return;
      }
      form.append(key, uploadRequest[key]);
    });
    form.append('file', binaryData);
    fetch(uploadRequest.url, {
      method: 'POST',
      body: form,
    })
      .then((response) => {
        resolve({
          fileKey: fileKey,
          filePath: uploadRequest.key,
          s3Response: response,
        });
      })
      .catch(reject);
  });
}
