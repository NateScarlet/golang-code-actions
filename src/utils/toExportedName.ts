import upperFirst from "./upperFirst";

export default function toExportedName(name: string): string {
  switch (name) {
    case "id":
      return "ID";
    case "url":
      return "URL";
    case "api":
      return "API";
    case "http":
      return "HTTP";
    case "https":
      return "HTTPS";
    case "json":
      return "JSON";
    case "xml":
      return "XML";
    case "sql":
      return "SQL";
    case "uuid":
      return "UUID";
    case "html":
      return "HTML";
    case "css":
      return "CSS";
    case "tcp":
      return "TCP";
    case "udp":
      return "UDP";
    case "ip":
      return "IP";
    case "ftp":
      return "FTP";
    case "ssl":
      return "SSL";
    case "tls":
      return "TLS";
    case "rpc":
      return "RPC";
    case "rest":
      return "REST";
    case "soap":
      return "SOAP";
    case "jwt":
      return "JWT";
    case "oauth":
      return "OAuth";
    default:
      return upperFirst(name);
  }
}
