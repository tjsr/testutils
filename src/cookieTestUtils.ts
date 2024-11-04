import { Response } from 'express';
import { SessionId } from "./types.js";
import supertest from "supertest";

export const expectSetSessionCookieHeaderOnResponseMock = (
  cookieIdKey: string,
  response: Response,
  sessionID: string
) => {
  expect(response.set).toBeCalledWith('Set-Cookie', `${cookieIdKey}=${sessionID}; Path=/; HttpOnly; SameSite=Strict`);
};


export const expectSetSessionCookieOnResponseMock = (cookieIdKey: string, response: Response, sessionID: string) => {
  expect(response.cookie).toBeCalledWith(cookieIdKey, sessionID, { httpOnly: true, path: '/', strict: true });
};

export const getSessionIdFromSetCookieString = (cookieIdKey: string, cookieString: string): SessionId => {
  const cookieMatches = cookieString.match(new RegExp(`${cookieIdKey}=([a-f0-9\\-]+);(.*)?`));
  expect(cookieMatches, `At least one ${cookieIdKey}= cookie needs to be present`).not.toBeUndefined();

  const firstMatch: string | undefined = cookieMatches![1];

  expect(firstMatch, `${cookieIdKey}= cookie should have a value`).not.toBeUndefined();
  return firstMatch!;
};

export const getSupertestSessionIdCookie = (
  cookieIdKey: string,
  response: supertest.Response
): SessionId | undefined => {
  const cookieValue: string | undefined = response.get('Set-Cookie')![0];
  expect(cookieValue, 'Set-Cookie should have at least one value').not.toBeUndefined();

  return getSessionIdFromSetCookieString(cookieIdKey, cookieValue!);
};


export const expectSessionCookieHeaderOnResponseMock = (response: Response, sessionID: string) => {
  expect(response.cookie).toBeCalledWith('sessionId', sessionID, { httpOnly: true, path: '/', strict: true });
};
