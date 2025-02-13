import os
import json
import psycopg2
import requests
from jwt import JWT, jwk_from_pem

def get_db_connection():
    return psycopg2.connect(
        host=os.environ['RDS_HOST'],
        database=os.environ['RDS_DB'],
        user=os.environ['RDS_USER'],
        password=os.environ['RDS_PASSWORD']
    )

def verify_token(event):
    token = event['headers'].get('Authorization', '').split('Bearer ')[-1]

    jwks_url = f"https://cognito-idp.{os.environ['AWS_REGION']}.amazonaws.com/{os.environ['USER_POOL_ID']}/.well-known/jwks.json"
    jwks = requests.get(jwks_url).json()

    headers = jwt.get_unverified_header(token)
    public_key = jwk_from_pem(jwks['keys'][0])
    claims = jwt.decode(token, public_key, algorithms=['RS256'])

    return claims['sub']


def lambda_handler(event, context):
    try:
        user_id = verify_token(event)

        path = event['path']
        method = event['httpMethod']

        if path == '/devices' and method == 'POST':
            return register_device(event, user_id)
        elif path == '/jobs' and method == 'POST':
            return submit_job(event, user_id)

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }


def register_device(event, user_id):
    body = json.loads(event['body'])

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO devices (user_id, name, specs)
                VALUES (%s, %s, %s)
                RETURNING device_id
            """, (user_id, body['name'], json.dumps(body['specs'])))

            device_id = cur.fetchone()[0]
            conn.commit()

    return {
        'statusCode': 201,
        'body': json.dumps({'device_id': device_id})
    }


def submit_job(event, user_id):
    body = json.loads(event['body'])

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO jobs (user_id, script)
                VALUES (%s, %s)
                RETURNING job_id
            """, (user_id, body['script']))

            job_id = cur.fetchone()[0]
            conn.commit()

    return {
        'statusCode': 201,
        'body': json.dumps({'job_id': job_id})
    }
