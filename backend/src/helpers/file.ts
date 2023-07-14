// Assuming path has the \\ divider, and foldersToRemove the / divider
export const removeFolders = (path: string, foldersToRemove: string) => {
  const foldersToRemovePattern = `^${foldersToRemove.replace(/\//g, "\\\\")}\\\\`;
  return path.replace(new RegExp(foldersToRemovePattern), "");
};
