Option 2 — via curl:
First create an admin user:
bashnpx medusa user -e admin@example.com -p admin123

Then login to get an admin token:
bashcurl -X POST http://localhost:9000/auth/user/emailpass \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin123"}'


Then create a publishable key:
bashcurl -X POST http://localhost:9000/admin/api-keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{"title": "Storefront", "type": "publishable"}'
Copy the token from the response.



SQS Queue

check the queue -> docker-compose exec localstack awslocal sqs list-queues
create queue -> docker-compose exec localstack awslocal sqs create-queue --queue-name booking-processing


directus link 
-> http://localhost:8055/admin/settings/flows/be1f4c26-a46a-44e2-8d0a-eb193d9a09a8