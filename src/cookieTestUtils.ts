import { SessionId } from "./types.js";
import supertest from "supertest";
import { validate } from "uuid";

const parseCookie = (cookieHeader: string): Record<string, string> => {
  const elements: Record<string, string> = {};
  if (!cookieHeader) return elements;

  cookieHeader.split(`;`).forEach(function(cookie) {
    let [ name, ...rest] = cookie.split(`=`);
    name = name?.trim();
    if (!name) return;
    const value = rest.join(`=`).trim();
    if (!value) return;
    elements[name] = decodeURIComponent(value);
  });

  return elements;
};

const getSidFromSignedSessionId = (signedSessionId: string): string|undefined => {
  const sid = signedSessionId.split(`.`)[0];
  return sid?.substring(2);
};

export const getSessionIdFromSetCookieString = (cookieIdKey: string, cookieString: string): SessionId => {
  const cookieParts = parseCookie(cookieString);
  const sidPart = cookieParts[cookieIdKey];

  expect(sidPart).not.toBeUndefined();
  const cookieSessionId = getSidFromSignedSessionId(sidPart!);
  expect(cookieSessionId, `${cookieIdKey}= cookie should have a value`).not.toBeUndefined();
  expect(validate(cookieSessionId!),
    `Returned cookie sessionId ${cookieSessionId} was not a valid uuid from cookie string ${cookieString}`
  ).toBe(true);
  return cookieSessionId!;
};

export const getSupertestSessionIdCookie = (
  cookieIdKey: string,
  response: supertest.Response
): SessionId | undefined => {
  const cookieValue: string | undefined = response.get('Set-Cookie')![0];
  expect(cookieValue, 'Set-Cookie should have at least one value').not.toBeUndefined();

  return getSessionIdFromSetCookieString(cookieIdKey, cookieValue!);
};

export const getSetCookieString = (cookieIdKey: string, sessionId: string): string => {
  return `${cookieIdKey}=${sessionId}; Path=/; HttpOnly; SameSite=Strict`;
};

export const setSessionCookie = (
  app: supertest.Test,
  sessionIdKey: string,
  sessionId: string
): void => {
  app.set('Set-Cookie', getSetCookieString(sessionIdKey, sessionId));
};
