type ErrorWithMessage = {
  message: string;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return typeof (error as ErrorWithMessage).message !== 'undefined';
}

export function onError(error: unknown) {
  let message = String(error);

  if (!(error instanceof Error) && isErrorWithMessage(error) && error.message) {
    message = String(error.message);
  }

  // eslint-disable-next-line no-alert
  alert(message);
}
