import { removeFolders } from "../file";

it("Removes initial directories with '/' separator", () => {
  const res = removeFolders("dir1/dir2/dir3/file", "dir1/dir2");

  expect(res).toEqual("dir3\\file");
});

it("Removes initial directories with '\\' separator", () => {
  const res = removeFolders("dir1\\dir2\\dir3\\file", "dir1/dir2");

  expect(res).toEqual("dir3\\file");
});
