import { generateSessionIdForTestName, generateSessionSecretForTestName } from './testIdUtils.js';
import { getCookieFromSetCookieHeaderString, getSetCookieString } from './cookieTestUtils.js';

import { TaskContext } from 'vitest';

describe('getSessionIdFromSetCookieString', () => {
  test('Should return a sessionId value in a string with path.', (context:TaskContext) => {
    const sessionSecret = generateSessionSecretForTestName(context.task.name);
    const sessionId = generateSessionIdForTestName(context.task.name);
    const cookieString = getSetCookieString('sessionId', sessionId, sessionSecret);

    expect(getCookieFromSetCookieHeaderString('sessionId', cookieString, sessionSecret))
      .toEqual('ce70f0f0-56ee-52e1-871d-a65f2d6b7303');
  });

  test('Should return a connect.sid value in a string with path.', (context:TaskContext) => {
    const sessionSecret = generateSessionSecretForTestName(context.task.name);
    const sessionId = generateSessionIdForTestName(context.task.name);
    const cookieString = getSetCookieString('connect.sid', sessionId, sessionSecret);

    expect(getCookieFromSetCookieHeaderString('connect.sid', cookieString, sessionSecret))
      .toEqual('fbda4d1e-aa96-5de2-8535-643fb9ee851e');
  });

  test('Should return connect.sid with signing', (_context: TaskContext) => {
    const cookieSecret = 'some-secret-here';
    // eslint-disable-next-line max-len
    const testString = 'test.sid=s%3A9ddbb216-dd54-57c8-8821-3c9bf871c33a.zfyb%2BvSIhEw7eZbbhNPsCZc6r%2FuSR42OCLIbQclLr08; Path=/; HttpOnly; SameSite=Strict';
    expect(
      // testString
      getCookieFromSetCookieHeaderString('test.sid', testString, cookieSecret)
    ).toEqual('9ddbb216-dd54-57c8-8821-3c9bf871c33a');
  });
});

describe('getSetCookieString', () => {
  test('Should return a header string for an unsigned cookie key.', () => {
    expect(() => getSetCookieString(
      'test.unsigned.sid', 'd569a638-3fec-4e29-9b86-52f006ca45e4', undefined!)).toThrowError();
  });

  test('Should return a header string for an signed cookie key.', () => {
    const signedCookie = getSetCookieString(
      'test.signed.sid', 'd569a638-3fec-4e29-9b86-52f006ca45e4',
      'test-signed-secret'
    );
    expect(signedCookie)
      // eslint-disable-next-line max-len
      .toEqual('test.signed.sid=s%3Ad569a638-3fec-4e29-9b86-52f006ca45e4.T82LJ7uzZgVQbz8%2B2QH69JncmsYrPwq1Y9jE3qvgwHg; Path=/; HttpOnly; SameSite=Strict');
    console.log(signedCookie);
  });

});
