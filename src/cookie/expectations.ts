import { SessionId } from "../types.js";
import cookie from 'cookie';
import cookieParser from "cookie-parser";
import supertest from "supertest";

export const cookieHeadersAsObject = (setCookieHeaders: string[]|undefined): Record<string, string> => {
  const cookies:Record<string, string> = {};
  
  console.log(setCookieHeaders);
  setCookieHeaders?.forEach((c) => {
    const headerCookies = cookie.parse(c);
    Object.keys(headerCookies).forEach((key) => {
      if (headerCookies[key] !== undefined) {
        cookies[key] = headerCookies[key];
      }
    });
  });
  return cookies;
};

export const getParsedCookie = (
  cookies:Record<string, string>,
  cookieKey: string,
  secret: string|string[]) => {
  const parsedCookies = cookieParser.signedCookies(cookies, secret);
  const parsedCookie = parsedCookies[cookieKey];
  return parsedCookie;
};

export const expectResponseSetsCookie = (
  cookieKey: string,
  response: supertest.Response,
  expectedCookieValue: SessionId,
  secret: string|string[]
): void => {
  expect(cookieKey, 'Cookie key was undefined in test').not.toBeUndefined();
  const setCookieHeaders: string[]|undefined = response.get('Set-Cookie');
  expect(setCookieHeaders, 'No Set-Cookie headers on response object').not.toBeUndefined();
  expect(setCookieHeaders!.length, 'No Set-Cookie headers provided').toBeGreaterThan(0);
  const cookies:Record<string, string> = cookieHeadersAsObject(setCookieHeaders);
  // const cookieValue = response.get('Set-Cookie')![0]!;
  // expect(cookieValue).toBeDefined();
  // expect(cookieValue).toMatch(new RegExp(`sessionId=${expectedSessionId};`));
  // expect(cookieValue).toMatch(
  //   // eslint-disable-next-line max-len
  //   new RegExp(`${cookieKey}=s.*${expectedSessionId}.*; Path=(.*); Expires=(.*); HttpOnly; SameSite=Strict`)
  // );
  console.log('expectResponseSetsCookie', expectedCookieValue, cookies);

  expect(cookies[cookieKey], `No cookie ${cookieKey} found in provided cookies.`).not.toBeUndefined();

  const parsedCookie = cookieParser.signedCookies(cookies, secret);
  expect(parsedCookie, `Cookie from headers ${JSON.stringify(cookies)} could not be validated. ` +
    `  Key ${cookieKey} not valid for secret ${secret}`).not.toEqual(false);

  expect(parsedCookie[cookieKey],
    `Cookie for ${cookieKey} was expected to be ${expectedCookieValue} but had ${parsedCookie[cookieKey]}`
  ).toEqual(expectedCookieValue);
  // expect(parsedCookie['sessionIdKey']).toEqual(expectedSessionId);
};
