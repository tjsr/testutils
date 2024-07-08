import { Response } from 'express';
import { SessionId } from "./types.js";
import { expect } from "vitest";
import supertest from "supertest";

export const expectSessionCookieHeaderOnResponseMock = (response: Response, sessionID: string) => {
  expect(response.cookie).toBeCalledWith('sessionId', sessionID, { httpOnly: true, path: '/', strict: true });
};

export const expectSetSessionCookieOnResponseMock = (response: Response, sessionID: string) => {
  expect(response.set).toBeCalledWith('Set-Cookie', `sessionId=${sessionID}; Path=/; HttpOnly; SameSite=Strict`);
};

export const getSessionIdFromSetCookieString = (cookieString: string): SessionId => {
  const cookieMatches = cookieString.match(/sessionId=([a-f0-9\\-]+);(.*)?/);
  expect(cookieMatches, 'At least one sessionId= cookie needs to be present').not.toBeUndefined();

  const firstMatch: string|undefined = cookieMatches![1];
  expect(firstMatch, 'sessionId= cookie should have a value').not.toBeUndefined();
  return firstMatch!;
};

export const getSupertestSessionIdCookie = (response: supertest.Response): SessionId|undefined => {
  const cookieValue: string|undefined = response.get('Set-Cookie')![0];
  expect(cookieValue, 'Set-Cookie should have at least one value').not.toBeUndefined();

  return getSessionIdFromSetCookieString(cookieValue!);
};
