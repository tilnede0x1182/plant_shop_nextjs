"use client";

import { useEffect } from "react";

export default function BootstrapScript() {
	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js";
		script.defer = true;
		document.body.appendChild(script);
	}, []);

	return null;
}
