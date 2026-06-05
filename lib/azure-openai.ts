import { AzureOpenAI } from "openai";

const apiKey = process.env.AZURE_OPENAI_API_KEY;
const instance = process.env.AZURE_OPENAI_API_INSTANCE_NAME;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

export const DEPLOYMENT_HEAVY = process.env.AZURE_OPENAI_DEPLOYMENT_HEAVY ?? "";
export const DEPLOYMENT_NANO = process.env.AZURE_OPENAI_DEPLOYMENT_NANO ?? "";

function endpoint(): string {
  if (!instance) throw new Error("AZURE_OPENAI_API_INSTANCE_NAME is not set");
  return `https://${instance}.openai.azure.com`;
}

function makeClient(deployment: string): AzureOpenAI {
  if (!apiKey) throw new Error("AZURE_OPENAI_API_KEY is not set");
  if (!apiVersion) throw new Error("AZURE_OPENAI_API_VERSION is not set");
  if (!deployment) throw new Error("Azure OpenAI deployment name is not set");
  return new AzureOpenAI({
    apiKey,
    apiVersion,
    endpoint: endpoint(),
    deployment,
  });
}

export const heavyClient = () => makeClient(DEPLOYMENT_HEAVY);
export const nanoClient = () => makeClient(DEPLOYMENT_NANO);

export function isAzureConfigured(): boolean {
  return !!(apiKey && instance && apiVersion && DEPLOYMENT_HEAVY);
}

export function isNanoConfigured(): boolean {
  return !!(apiKey && instance && apiVersion && DEPLOYMENT_NANO);
}
