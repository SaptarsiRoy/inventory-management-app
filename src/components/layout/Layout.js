// Description: This is the layout component. It is used to wrap the entire application.
import Head from "next/head"

export default function layout({children}) {
    return (
        <>
            <Head>
                <title>{"Inventory Manager"}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="description" content="Simple inventory management app" />
                <meta name="author" content="Saptarsi Roy" />
            </Head>
            <main>{children}</main>
        </>
    )
}