exports.get404Page = (req, res) => {
  res.status(404).render(`error`, {
    path: `/error`,
    docTitle: `Error Page`,
    errorMessage: `Page is not found`,
  });
};
