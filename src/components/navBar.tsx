import { authContextData } from "@/context/authContext";
import { auth, signOutUser } from "@/firebase/firebaseauth";
import { usePathname, useRouter } from "next/navigation";
import style from "../app/all-post/main.module.css";


export default function NavBar() {
  const { user } = authContextData()!;
  const pathname = usePathname();
  const router = useRouter();


  const handleNavigate = () => {
    if (user && user.role === "admin") {
      if (pathname === "/all-post") {
        router.push("/AdminDashBorad");
      } else if (pathname === "/AdminDashBorad") {
        router.push("/all-post");
      } else if (pathname.startsWith("/editPost")) {
        router.push("/all-post");
      } else if (pathname === "/home") {
        router.push("/all-post");
      } else if (pathname.startsWith("/post-details")) {
        router.push("/all-post");
      } else {
        if (pathname === "/home" || pathname.startsWith("/post-details")) {
          router.push("/login");
        }
      }
    } else {
      router.push("/login");
    }
  };

  const userHandleNavigate = () => {
    if (user) {
      if (user.role === "admin" && pathname !== "/home") {
        router.push("/home");
      } else if (user.role !== "admin" && pathname === "/home") {
        router.push("/signup");
      } else if (
        user.role !== "admin" &&
        pathname.startsWith("/post-details")
      ) {
        router.push("/home");
      }
    } else {
      if (pathname !== "/signup") {
        router.push("/signup");
      }
    }
  };


  return (
    <>
      <div 
        id={style.navbar}
        className="navbar bg-base-100" 
      >
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a onClick={handleNavigate}>
                  {user?.role === "admin" && pathname === "/all-post"
                    ? "Create Post"
                    : user?.role === "admin"
                    ? "List All Post"
                    : "Login"}
                </a>
              </li>

              <li>
                <a onClick={userHandleNavigate}>
                  {user
                    ? user.role === "admin" && pathname !== "/home"
                      ? "Home"
                      : user.role !== "admin" && pathname === "/home"
                      ? "Signup"
                      : pathname.startsWith("/post-details")
                      ? "Home"
                      : "Signup"
                    : "Signup"}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="navbar-center">
          <a className="btn btn-ghost text-xl"> Blog Crafted
            {/* {user
              ? user.role === "admin"
                ? "Admin Dashboard"
                : "User Dashboard"
              : "Home Dashboard"} */}
          </a>
        </div>
        <div className="navbar-end">
          {user ? (
               <button
               className={style.sign_Out_Button}
               // className="btn btn-outline"
               onClick={() => {
                 signOutUser(auth);
               }}
             >
               Sign out
             </button>
          ) : (
            <></>
          )}
         
        </div>
      </div>
    </>
  );
}
