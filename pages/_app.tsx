import { AppProps } from "next/app";
import "@/styles/app.scss";

function RoktoAppRoot({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default RoktoAppRoot;
