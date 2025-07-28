// This file provides a basic type declaration for the 'xss-clean' module,
// which does not have its own @types package. This declaration tells TypeScript
// that the module exists and exports a default function, resolving import errors.
declare module 'xss-clean' {
  function xssClean(): (req: any, res: any, next: () => void) => void;
  export = xssClean;
}