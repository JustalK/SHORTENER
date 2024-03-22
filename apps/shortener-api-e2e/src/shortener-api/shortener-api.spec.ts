import axios from 'axios';

describe('GET /', () => {
  it('[SUCCESS] Check the api is running with the healthcheck', async () => {
    const res = await axios.get(`/v1/server/healthcheck`);

    expect(res.status).toBe(200);
    expect(res.data.status).toBe('running');
  });

  it('[SUCCESS] Check to shorten https://www.google.com', async () => {
    let res = null;
    try {
      res = await axios.post(`/v1/shortener`, {
        // Check a longURL not reachable
        longURL: 'https://www.google.com',
      });
    } catch (e) {
      throw new Error(e);
    }

    expect(res.data.longURL).toBe('https://www.google.com');
    expect(res.data.shortURL).toBeDefined();
    expect(res.data.countUsage).toBeDefined();

    const shortURL = res.data.shortURL;
    const countUsage = res.data.countUsage;

    try {
      await axios.get(`/${shortURL}`);
    } catch (e) {
      throw new Error(e);
    }

    try {
      res = await axios.post(`/v1/shortener`, {
        // Check a longURL not reachable
        longURL: 'https://www.google.com',
      });
    } catch (e) {
      throw new Error(e);
    }

    expect(res.data.countUsage).toBe(countUsage + 1);
  });

  it('[FAIL] Check a redirection that does not exist: no link found', async () => {
    let res = null;
    try {
      res = await axios.get(`/fail`);
    } catch (e) {
      throw new Error(e);
    }
    expect(res.status).toBe(200);
    expect(res.request.res.responseUrl).toMatch(/error=X0010/);
  });

  it('[FAIL] Check a link that does not work: not a link', async () => {
    try {
      await axios.post(`/v1/shortener`, {
        // Check a longURL not reachable
        longURL: 'sdqsdqdqdqd',
      });
    } catch (e) {
      // Check status of response
      const { response } = e;
      const { data } = response;
      expect(response.status).toBe(500);
      // Check error
      const { error } = data;
      expect(error.code).toBe('X0003');
      expect(error.message).toBe('This is not a valid URL');
    }
  });

  it('[FAIL] Check a link that does not work: not reachable', async () => {
    try {
      await axios.post(`/v1/shortener`, {
        // Check a longURL not reachable
        longURL: 'https://www.justalkevin2.com/',
      });
    } catch (e) {
      // Check status of response
      const { response } = e;
      const { data } = response;
      expect(response.status).toBe(500);
      // Check error
      const { error } = data;
      expect(error.code).toBe('X0011');
      expect(error.message).toBe('The url is not reachable');
    }
  });

  it('[FAIL] Check a redirection that expired: link expired', async () => {
    let res = null;
    try {
      res = await axios.post(`/v1/shortener`, {
        // Check a longURL not reachable
        longURL: 'https://dev.to',
      });
    } catch (e) {
      throw new Error(e);
    }

    const shortURL = res.data.shortURL;
    try {
      res = await axios.get(`/${shortURL}`);
    } catch (e) {
      throw new Error(e);
    }

    expect(res.status).toBe(200);
    expect(res.request.res.responseUrl).toMatch(/error=X0008/);
  });
});
