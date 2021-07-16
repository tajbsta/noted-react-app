interface IEmailPayload {
  id: string;
  raw: string;
  internalDate: string;
  decodedBody?: string;
}

export default IEmailPayload;
