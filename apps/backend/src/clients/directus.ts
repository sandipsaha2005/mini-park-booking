import { createDirectus, rest, staticToken } from '@directus/sdk';

const directusClient = createDirectus(process.env.DIRECTUS_URL!)
    .with(staticToken(process.env.DIRECTUS_TOKEN!))
    .with(rest())

export default directusClient;
