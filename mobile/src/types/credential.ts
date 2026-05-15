export type VaultCredential = {
  id?: string;
  title?: string;
  name?: string;
  username?: string;
  password?: string;
  url?: string;
  note?: string;
};

export type CredentialFormState = {
  title: string;
  username: string;
  password: string;
  url: string;
  note: string;
};

export const emptyCredentialForm: CredentialFormState = {
  title: "",
  username: "",
  password: "",
  url: "",
  note: "",
};
