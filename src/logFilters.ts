let ignored: (string|RegExp)[] = ['You are running in development mode.', 'Found no env files to load.'];

let ignoredSourceMethods: string[] = [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LogFunctionMethod = (_message?: any, ..._optionalParams: any[]) => void;
type NamedFunction = (...args: never[]) => unknown;

const filterIgnored = (callback: LogFunctionMethod, ...args: unknown[]) => {
  const firstArg = args?.[0];
  let msg;
  if (typeof firstArg === 'function') {
    if (ignoredSourceMethods.includes(firstArg.name)) {
      return;
    }
    msg = args?.[1];
  } else {
    msg = args?.[0];
  }

  if (typeof msg === 'function' && typeof firstArg === 'function' && ignoredSourceMethods.includes(firstArg.name)) {
    return;
  }
  if (typeof msg !== 'string' || !ignored.some((ignoredMsg) => {
    if (typeof ignoredMsg === 'string' && msg.includes(ignoredMsg)) {
      return true;
    } else if (ignoredMsg instanceof RegExp && ignoredMsg.test(msg)) {
      return true;
    }
    return false;
  })) {
    callback(...args);
  }
};

export const useLogFilters = () => {
  const { info, log, warn, error } = console;
  console.info = (...args) => filterIgnored(info, ...args);
  console.log = (...args) => filterIgnored(log, ...args);
  console.warn = (...args) => filterIgnored(warn, ...args);
  console.error = (...args) => filterIgnored(error, ...args);
  console.debug = (...args) => filterIgnored(error, ...args);
};

export const addIgnoredLog = (msg: string|RegExp) => {
  ignored.push(msg);
};

export const addIgnoredLogsFromFunction = (...fns: NamedFunction[]) => {
  fns.forEach((fn) => {
    ignoredSourceMethods.push(fn.name);
  });
};

export const removeIgnoredLogsFromFunction = (fn: NamedFunction) => {
  ignoredSourceMethods = ignoredSourceMethods.filter((ignoredFn) => ignoredFn !== fn.name);
};

export const clearIgnoredFunctions = () => {
  ignoredSourceMethods = [];
};

export const clearIgnoreLogFilters = () => {
  ignored = [];
};
