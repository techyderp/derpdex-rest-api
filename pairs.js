const express = require('express');
const axios = require('axios');

const app = express();

const GRAPHQL_API_URL = 'https://api.studio.thegraph.com/query/49147/derpdex-v3-amm/v0.0.6';

app.get('/pairs', async (req, res) => {
    try {
        const response = await axios.post(GRAPHQL_API_URL, {
            query: `
                query {
                  pools {
                    id
                    token0 {
                      id
                      symbol
                    }
                    token1 {
                      id
                      symbol
                    }
                  }
                }
            `
        });

        const pools = response.data.data.pools;
        const pairs = []

        for (let i = 0; i < pools.length; i++) {
            pairs.push({
                "ticker_id": `${pools[i].token0.id}_${pools[i].token1.id}`,
                "base": pools[i].token0.id,
                "target": pools[i].token1.id,
                "pool_id": pools[i].id
            })
        }

        res.json(pairs);
    } catch (error) {
        console.error('Error fetching pools:', error);
        res.status(500).json({ error: 'Failed to fetch pools' });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});