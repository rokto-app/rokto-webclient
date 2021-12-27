import { AppProps } from "next/app";
import "@/styles/app.scss";
import { GoogleMapProvider } from "@/lib/GoogleMap";

function RoktoAppRoot({ Component, pageProps }: AppProps) {
  return (
    <GoogleMapProvider apiKey={process.env.NEXT_PUBLIC_MAP_API}>
      <Component {...pageProps} />
    </GoogleMapProvider>
  );
}

export default RoktoAppRoot;
