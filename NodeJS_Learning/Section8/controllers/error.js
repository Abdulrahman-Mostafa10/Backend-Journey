exports.get404Page = (req, res) => {
  res.status(404).render(`404`, {
    path: `/404`,
    docTitle: `Error Page`,
    errorMessage: `Page is not found`,
  });
};
