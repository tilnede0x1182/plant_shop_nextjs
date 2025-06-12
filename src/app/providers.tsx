"use client";

import { SessionProvider, useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

function SessionChecker() {
	const { data: session } = useSession();

	useEffect(() => {
		if (!session?.user?.id) return;
		fetch(`/api/users/${(session.user as { id: string }).id}`).then(
			(res) => {
				if (!res.ok) signOut();
			}
		);
	}, [session?.user?.id]);

	return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<SessionChecker />
			{children}
		</SessionProvider>
	);
}
