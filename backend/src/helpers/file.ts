export const removeFolders = (path: string, foldersToRemove: string) => {
  const hasBackSlash = Boolean(path.match(/\\/));

  if (hasBackSlash) {
    const foldersToRemovePattern = `^${foldersToRemove.replace(/\//g, "\\\\")}\\\\`;
    return path.replace(new RegExp(foldersToRemovePattern), "");
  }

  const foldersToRemovePattern = `^${foldersToRemove}\/`;
  return path.replace(new RegExp(foldersToRemovePattern), "").replace(/\//g, "\\");
};
