const axios = require('axios');
const assert = require('assert');

test('GET /api/health should return 200', async () => {
    const response = await axios.get('http://localhost:3000/api/health');
    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.data, { status: 'ok' });
});