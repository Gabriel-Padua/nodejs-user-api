function createError(status, message, field, detail) {
  return {
    status,
    message,
    error: {
      field,
      detail,
    },
  };
}

export default createError;
