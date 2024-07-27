// import { useState, useEffect, useCallback } from 'react';
// import { useRouter } from "next/navigation";
// import { useAuthContext } from '../hooks';

// type Props = {
//   children: React.ReactNode;
// };

// export default function AuthGuard({ children }: Props) {
//   return <Container>{children}</Container>;
// }

// function Container({ children }: Props) {
//   const router = useRouter();
//   const { authenticated } = useAuthContext();
//   const [checked, setChecked] = useState(false);

//   const check = useCallback(() => {
//     if (!authenticated) {
//       const searchParams = new URLSearchParams({
//         returnTo: window.location.pathname,
//       }).toString();

//       const loginPath = '/login'; // Directly provide the login path here

//       const href = `${loginPath}?${searchParams}`;

//       router.replace(href);
//     } else {
//       setChecked(true);
//     }
//   }, [authenticated, router]);

//   useEffect(() => {
//     check();
//   }, [check]);

//   if (!checked) {
//     return null;
//   }

//   return <>{children}</>;
// }
