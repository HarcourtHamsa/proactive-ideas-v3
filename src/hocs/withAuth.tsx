import React, { useEffect } from "react";
import { useRouter } from "next/router";
import useAuth from "../hooks/useAuth";

const withAuth = (WrappedComponent: any) => {
    const Wrapper = (props: any) => {
        const router = useRouter();
        const auth = useAuth();

        return <WrappedComponent {...props} />

    }


    return Wrapper
}

export default withAuth