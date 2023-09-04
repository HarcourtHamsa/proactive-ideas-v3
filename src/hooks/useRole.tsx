import useCookie from "./useCookie";

function useRole() {
    const cookie = useCookie();

    return cookie?.user.role;
}

export default useRole;
