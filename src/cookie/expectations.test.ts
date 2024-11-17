import { cookieHeadersAsObject } from "./expectations.js";
import cookieParser from "cookie-parser";

describe('cookieHeadersAsObject', () => {
  test('Should return a split Set-Cookie header', () => {
    const testHeaders = [
      // eslint-disable-next-line max-len
      'test.sid=s%3Ac41a8267-d6e6-4275-abbc-ceecf4228422.jCio9bqmxcwktSp%2BfyS%2Blp%2B1a8Y%2BvdeuVlluHX3ezJ8; Path=/; Expires=Sun, 10 Nov 2024 00:09:34 GMT; HttpOnly; SameSite=Strict',
    ];
    const cookies = cookieHeadersAsObject(
      testHeaders
    );
    // eslint-disable-next-line max-len
    expect(cookies['test.sid']).toEqual('s:c41a8267-d6e6-4275-abbc-ceecf4228422.jCio9bqmxcwktSp+fyS+lp+1a8Y+vdeuVlluHX3ezJ8');
  });
});

describe('expectResponseSetsCookie', () => {
  test('Should return sessionId value from full signed cookie', () => {
    // const cookies: Record<string, string> = {
    // eslint-disable-next-line max-len
    // 'test.sid': 's:c41a8267-d6e6-4275-abbc-ceecf4228422.jCio9bqmxcwktSp+fyS+lp+1a8Y+vdeuVlluHX3ezJ8; Path=/; Expires=Sun, 10 Nov 2024 00:09:34 GMT; HttpOnly; SameSite=Strict',
    // };
    // expectResponseSetsCookie()
  });
});

describe('getParsedCookie', () => {
  test('Should get a cookie value from a signed cookie', () => {
    const cookies: Record<string, string> = {
      'test.sid': 's:c41a8267-d6e6-4275-abbc-ceecf4228422.jCio9bqmxcwktSp+fyS+lp+1a8Y+vdeuVlluHX3ezJ8',
    };
    const cookieKey = 'test.sid';
    const secret = 'test-secret';
    const parsedCookies = cookieParser.signedCookies(cookies, secret);
    expect(parsedCookies[cookieKey]).toEqual('c41a8267-d6e6-4275-abbc-ceecf4228422');
  });

  test('Should test a non-uuid signed cookie', () => {
    const kcCookies = {
      'foo': 's:foobar.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE',
    };
    const cookies = cookieParser.signedCookies(kcCookies, 'keyboard cat');
    expect(cookies['foo']).toEqual('foobar');
  });
  
  test('Should reject a tampered with cookie', () => {
    const kcCookies = {
      'foo': 's:foobaz.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE',
    };
    const cookies = cookieParser.signedCookies(kcCookies, 'keyboard cat');

    expect(cookies['foo']).toEqual(false);
  });

  test('Should not return an unsigned cookie when a secret is provided', () => {
    const cookies: Record<string, string> = {
      'test.sid': 'c41a8267-d6e6-4275-abbc-ceecf4228422',
    };
    const cookieKey = 'test.sid';
    const secret = 'test-secret';
    const parsedCookie = cookieParser.signedCookies(cookies, secret);

    expect(parsedCookie[cookieKey]).toEqual(undefined);
  });
});
