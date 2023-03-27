import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { SchemaProvider } from "~/contexts";
import { Head } from "~/components/Layout/Head";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <SchemaProvider>
        <Head />
        <Component {...pageProps} />
      </SchemaProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
