import { redirect } from "next/navigation";

// Toute 404 → redirection vers /plants
export default function NotFound() {
	redirect("/plants");
}
