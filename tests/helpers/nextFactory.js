export function makeNext() {
  let called = false;

  function next() {
    called = true;
  }

  next.called = () => called;

  return next;
}
