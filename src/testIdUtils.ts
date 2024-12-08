import { IdNamespace, SessionId, SessionSecret, UserId } from './types.js';
import { NIL_UUID, SESSION_SECRET_UUID, createTestRunNamespace } from './testNamespaceUtils.js';

import crypto from 'crypto';
import { v5 } from 'uuid';

const CURRENT_TEST_RUN_ID = Math.floor(Math.random() * 1000);

/*
 * @deprecated
 */
export const generateSuiteId = (suiteId: string, suiteRange = 1000): number => {
  const hash = crypto.createHash('md5').update(suiteId).digest('hex');
  const number = parseInt(hash.substring(0, 15), 16) % suiteRange;
  return number;
};

/*
 * @deprecated
 */
export const generateTestIdNumber = (suiteId: string, suiteRange = 1000, range = 1000000): number => {
  const testIdNumber = generateSuiteId(suiteId) * suiteRange + CURRENT_TEST_RUN_ID + range;
  return testIdNumber;
};

/*
 * @deprecated
 */
export const generateTestIdString = (suiteId: string, prefix = 'id', range = 1000): string => {
  const testIdNumber = generateTestIdNumber(suiteId, range);
  return `${prefix}${testIdNumber.toString().padStart(7, '0')}`;
};

/*
 * @deprecated
 */
export const createTestUserId = (suite: string): string => {
  return generateTestIdString(suite, 'u', 1000);
};

/*
 * @deprecated
 */
export const createTestObjectId = (suite: string): string => {
  return generateTestIdString(suite, 'o', 1000);
};

/*
 * @deprecated
 */
export const createTestSessionId = (suite: string): string => {
  return generateTestIdString(suite, 'o', 1000);
};

const generatePrefixedUuidForTest = (
  testName: string, namespace: IdNamespace = NIL_UUID, prefix?: string
): IdNamespace => {
  const taskNamespace: IdNamespace = createTestRunNamespace(testName, namespace);

  const uuidForTask: IdNamespace = v5((prefix ? prefix + '-' : '') + testName, taskNamespace);
  return uuidForTask;
};

export const generateSessionIdForTestName = (testName: string, sessionPrefix?: string): SessionId => {
  return generatePrefixedUuidForTest(testName, NIL_UUID, sessionPrefix);
};

export const generateUserIdForTestName = (testName: string, userPrefix?: string): UserId => {
  return generatePrefixedUuidForTest(testName, NIL_UUID, userPrefix);
};

export const generateSessionSecretForTestName = (
  testName: string,
  sessionPrefix?: string
): SessionSecret => generatePrefixedUuidForTest(
  testName,
  sessionPrefix,
  SESSION_SECRET_UUID
);
