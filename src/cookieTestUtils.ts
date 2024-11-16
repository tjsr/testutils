import { SessionId, SessionSecret, SessionSecretSet } from "./types.js";

import cookie from 'cookie';
import cookieParser from "cookie-parser";
import signature from "cookie-signature";
import supertest from "supertest";
import { validate } from "uuid";

export const getCookieFromSetCookieHeaderString = (
  cookieIdKey: string,
  cookieHeader: string,
  secret: SessionSecretSet
): SessionId => {
  const cookieObject: Record<string, string|undefined> = cookie.parse(cookieHeader);
  expect(cookieObject[cookieIdKey], `Cookie ${cookieIdKey} not found in ${cookieHeader}`).not.toBeUndefined();
  const parsedCookie = cookieParser.signedCookie(cookieObject[cookieIdKey]!, secret);

  expect(parsedCookie,
    `Parsed cookie ${cookieObject[cookieIdKey]} did not match session secret ${secret}.`).not.toEqual(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof parsedCookie === 'object' && (parsedCookie as any)[cookieIdKey] === false) {
    throw new Error(`Cookie ${cookieObject[cookieIdKey]} object was not signed correctly with secret ${secret}`);
  }
  expect(parsedCookie, `${cookieIdKey} not found on cookie ${cookieHeader} (${parsedCookie})`).not.toBeUndefined();
  // expect(typeof parsedCookie, 
  //   `Cookie result is ${parsedCookie} for input string ${cookieHeader} ` + 
  //   'but should be parsed out as object when correctly signed.').not.toEqual('string'); 

  // const cookieSessionId = (parsedCookie as any)[cookieIdKey];

  // expect(cookieSessionId, `${cookieIdKey}= cookie should have a value`).not.toBeUndefined();
  expect(validate(parsedCookie!),
    `Returned cookie ${parsedCookie} was not a valid uuid from cookie string ${cookieHeader}`
  ).toBe(true);
  return parsedCookie! as string;
};

export const getSetCookieFromResponse = (response: supertest.Response): string => {
  const cookieHeaders = response.get('Set-Cookie');
  assert(cookieHeaders !== undefined, 'Set-Cookie header should have been set');
  assert(cookieHeaders.length > 0, 'Set-Cookie header should have at least one value');
  expect(cookieHeaders[0]).not.toBeUndefined();
  return cookieHeaders[0]!;
};

export const getSupertestSessionIdCookie = (
  cookieIdKey: string,
  response: supertest.Response,
  sessionSecret: SessionSecretSet
): SessionId | undefined => {
  const cookieValue: string = getSetCookieFromResponse(response);
  return getCookieFromSetCookieHeaderString(cookieIdKey, cookieValue!, sessionSecret);
};

/**
 * 
 * @param cookieIdKey 
 * @param cookieValue 
 * @param secret 
 * @param options 
 * @returns Signed, URLEncoded string that can be sent in a Set-Cookie header
 */
export const getSetCookieString = (
  cookieIdKey: string,
  cookieValue: string,
  secret: SessionSecretSet,
  options?: cookie.SerializeOptions
): string => {
  if (!secret) {
    throw new Error('Do not use unsigned cookies.');
  }
  if (Array.isArray(secret) && secret.length === 0) {
    throw new Error('Secret list was an empty array. Must have at least one secret.');
  }
  if (cookieValue === undefined) {
    throw new Error(`Cookie value to set for ${cookieIdKey} was undefined`);
  }
  if (typeof cookieValue !== 'string') {
    throw new Error('Provided cookie value is not a string');
  }
  const cipherSecret: SessionSecret = Array.isArray(secret) ? secret[0] as string : secret as string;
  cookieValue = 's:' + signature.sign(cookieValue, cipherSecret);
  const cookieString = cookie.serialize(cookieIdKey, cookieValue, {
    ...options,
    httpOnly: options?.httpOnly ?? true,
    path: options?.path ?? '/',
    sameSite: options?.sameSite ?? 'strict',
  });
  assert(cookieString !== undefined, 'Cookie string should have been defined');
  assert(cookieString !== '', 'Cookie string should not have been empty');
  return cookieString;
};

export const setSessionCookie = (
  app: supertest.Test,
  sessionIdKey: string,
  sessionId: SessionId,
  secret: SessionSecretSet
): supertest.Test => {
  assert(sessionId !== undefined,
    `Session ID for ${sessionIdKey} was passed to set on supertest app as undefined (secret=${secret}).`);
  return app.set('Cookie', getSetCookieString(sessionIdKey, sessionId, secret));
};
