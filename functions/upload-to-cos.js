import COS from 'cos-nodejs-sdk-v5';

const cos = new COS({
  SecretId: process.env.TENCENT_SECRET_ID,
  SecretKey: process.env.TENCENT_SECRET_KEY
});

const BUCKET = process.env.TENCENT_BUCKET || 'juiceqiuqiu-1420133198';
const REGION = process.env.TENCENT_REGION || 'ap-shanghai';

export async function handler(event, context) {
  const { method, headers, body } = event;
  
  const headers_obj = typeof headers === 'string' ? JSON.parse(headers) : headers;
  const body_obj = typeof body === 'string' ? JSON.parse(body) : body;
  
  if (method !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
  
  try {
    const { image, faceIndex } = body_obj;
    
    if (!image || !faceIndex) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Missing image or faceIndex' })
      };
    }
    
    const base64Data = image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    const key = `six-faces/face-${faceIndex}-${Date.now()}.png`;
    
    return new Promise((resolve, reject) => {
      cos.putObject({
        Bucket: BUCKET,
        Region: REGION,
        Key: key,
        StorageClass: 'STANDARD',
        Body: buffer,
        ContentType: 'image/png'
      }, (err, data) => {
        if (err) {
          resolve({
            statusCode: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: err.message })
          });
        } else {
          const url = `https://${BUCKET}.cos.${REGION}.myqcloud.com/${key}`;
          resolve({
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ url, faceIndex })
          });
        }
      });
    });
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
}