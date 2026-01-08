export const extractUuidFromUrl = (url: string) => {
  //const match = url.match(/ucarecdn\.net\/([^/]+)/);
  const uuid = url.split("/")[3];
  return uuid;
};

export const deleteUploadcareFile = async (url: string) => {
  const uuid = extractUuidFromUrl(url);

  if (!uuid) throw new Error("Invalid Uploadcare URL");

  const res = await fetch(`https://api.uploadcare.com/files/${uuid}/`, {
    method: "DELETE",
    headers: {
      Accept: "application/vnd.uploadcare-v0.5+json",
      Authorization: `Uploadcare.Simple ${import.meta.env.VITE_UPLOAD_CARE_PUBLIC_KEY}:${import.meta.env.VITE_UPLOAD_CARE_SECRET_KEY}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete file from Uploadcare");
  }

  return true;
};
